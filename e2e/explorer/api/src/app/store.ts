import { Block, TransactionResponse, TransactionReceipt, Log } from '@ethersproject/abstract-provider';
import { EthAccount, ContractArtifact, ContractAccount, EthStore, isContract, EtherscanSourceCode } from '@explorer';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import { defaultAbiCoder } from '@ethersproject/abi';
import { id } from '@ethersproject/hash';
import { ABIDescription } from '@type/solc';
import { provider } from './provider';
import { BuildInfo } from 'hardhat/types'

function bignumberReviver(key: string, value: any) {
  if (typeof value === 'object' && value['type'] === 'BigNumber') return BigNumber.from(value);
  return value;
}
function copyWithBigNumber<T>(source: T): T {
  return JSON.parse(JSON.stringify(source), bignumberReviver)
}

export const store: EthStore = {
  blocks: [],
  states: [],
  transactions: {},
  receipts: {},
  addresses: {},
  logs: {},
  accounts: [],
  contracts: [],
  artifacts: {},
  builds: {}
}


///////////
// BLOCK //
///////////

export async function setBlock(block: Block) {
  if (block.number in store.blocks) return;
  store.blocks[block.number] = block;

  const getReceipts = block.transactions.map(hash => provider.getTransactionReceipt(hash));
  const getResponses = block.transactions.map(hash => provider.getTransaction(hash));
  const [txs, receipts] = await Promise.all([
    Promise.all(getResponses),
    Promise.all(getReceipts),
  ]);
  await setBlockTransactions(txs, receipts);
  await setState(block, receipts);
  // Update the balance to latest
  const setBalances = Object.values(store.addresses).map(setBalance);
  await Promise.all(setBalances);

}

//////////////////
// TRANSACTIONS //
//////////////////

/** Store transactions responses and receipt from a block */
async function setBlockTransactions(txs: TransactionResponse[], receipts: TransactionReceipt[]) {
  for (const tx of txs) {
    store.transactions[tx.hash] = tx;
  }
  const addReceipts = receipts.map(async receipt => {
    store.receipts[receipt.transactionHash] = receipt;
    setLogs(receipt);
    await addTxToAddress(receipt);
  })
  await Promise.all(addReceipts);
}


//////////
// LOGS //
//////////

/** Store the logs of a transaction receipt per address emitting these logs */
function setLogs(receipt: TransactionReceipt) {
  for (const log of receipt.logs) {
    if (!store.logs[log.address]) store.logs[log.address] = [];
    store.logs[log.address].unshift(log);
  }
}


/////////////
// ADDRESS //
/////////////
interface CreateEthAccount extends Partial<EthAccount> {
  address: string;
  isContract: boolean;
}

async function createEthAccount(params: CreateEthAccount) {
  store.addresses[params.address] = {
    transactions: [],
    balance: '0',
    isContract: false,
    ...params
  };
  if (params.isContract) {
    store.contracts.push(params.address);
    await linkArtifactToContract(params.address)
  } else {
    store.accounts.push(params.address);
  }
};

export async function setBalance({ address, isContract }: CreateEthAccount) {
  const balance = await provider.getBalance(address);
  if (!store.addresses[address]) await createEthAccount({ address, isContract });
  store.addresses[address].balance = balance.toString();
}

/** Add the artifact key to an address */
export async function addArtifactToAddress(address: string, artifact: ContractArtifact) {
  if (!store.addresses[address]) await createEthAccount({ address, isContract: true });
  (store.addresses[address] as ContractAccount).artifact = artifactKey(artifact);
}

/** Store the transaction hash to the addresses involved in the transaction */
async function addTxToAddress(receipt: TransactionReceipt) {
  const addresses = [receipt.from, receipt.to, receipt.contractAddress].filter(address => !!address);
  for (const address of addresses) {
    const isContract = address === receipt.contractAddress;
    if (!store.addresses[address]) await createEthAccount({ address, isContract });
    store.addresses[address].transactions.unshift(receipt.transactionHash);
  }
}

///////////
// STATE //
///////////

/** Set the state of the network at a specific block */
function setState(block: Block, receipts: TransactionReceipt[]) {
  // Copy previous
  if (store.states[block.number - 1]) {
    store.states[block.number] = copyWithBigNumber(store.states[block.number - 1]);
  } else {
    store.states[block.number] = { balances: {}, erc20: {}, erc721: {}, erc1155: {} };
  }
  setTransfers(receipts);
  // Get unique addresses
  const rawAddresses = [block.miner];
  for (const receipt of receipts) {
    rawAddresses.push(receipt.from);
    if (receipt.to) rawAddresses.push(receipt.to);
    if (receipt.contractAddress) rawAddresses.push(receipt.contractAddress);
  }
  const addresses = Array.from(new Set(rawAddresses));
  // Get new balance per unique addresses
  const setBalances = addresses.map(async address => {
    const balance = await provider.getBalance(address, block.number);
    store.states[block.number].balances[address] = balance;
  });
  return Promise.all(setBalances);
}

///////////////
//// BUILD ////
///////////////

export function setBuildInfo(info: BuildInfo) {
  const content = {}
  for (const path of Object.keys(info.input.sources)) {
    content[path] = {
      sourceCode: info.input.sources[path].content,
      contractName: info.input.sources[path],
      compilerVersion: info.solcVersion,
      optimizationUsed: info.input.settings.optimizer.enabled,
      runs: info.input.settings.optimizer.runs
    }
    store.builds[path] = content[path]
  }
}

///////////////
// ARTIFACTS //
///////////////

function artifactKey({ contractName, sourceName }: ContractArtifact) {
  return [sourceName, contractName].join('_');
}

/** Register the artifact and return the key */
export function setArtifact(artifact: ContractArtifact) {
  const { contractName, sourceName, abi, deployedBytecode } = artifact;
  const key = artifactKey(artifact);
  store.artifacts[key] = { contractName, sourceName, abi, deployedBytecode };
  const standard = contractStandard(abi);
  if (standard) store.artifacts[key].standard = standard;
  return key;
}

// If some variables are immutable they would be in the deployed bytecode but not the artifact...
export function getArtifact(code: string): ContractArtifact {
  return Object.values(store.artifacts).find(artifact => artifact.deployedBytecode === code);
}

async function linkArtifactToContract(address: string) {
  const code = await provider.getCode(address);
  const artifact = getArtifact(code);
  // TODO: if no artifact, try to recompile 
  if (!artifact) return;
  await addArtifactToAddress(address, artifact);
}

//////////////
// STANDARD //
//////////////
function abiNames(abi: ABIDescription[]) {
  const fields: Record<string, boolean> = {};
  for (const description of abi) {
    fields[description.name] = true;
  }
  return fields;
}
const standards = {
  ERC20: {
    methods: ['totalSupply', 'balanceOf', 'transfer', 'transferFrom', 'approve', 'allowance'],
    events: ['Transfer', 'Approval'],
  },
  ERC721: {
    methods: ['ownerOf', 'balanceOf', 'safeTransferFrom', 'setApprovalForAll', 'approve', 'getApproved', 'isApprovedForAll'],
    events: ['Transfer', 'Approval', 'ApprovalForAll'],
  },
  ERC1155: {
    methods: ['balanceOf', 'balanceOfBatch', 'safeTransferFrom', 'safeBatchTransferFrom', 'setApprovalForAll', 'isApprovedForAll'],
    events: ['TransferSingle', 'TransferBatch', 'ApprovalForAll', 'URI'],
  },
}
type Tokens = keyof typeof standards;
function isStandard(abi: ABIDescription[], name: Tokens) {
  const names = abiNames(abi);
  const { methods, events } = standards[name];
  return [...methods, ...events].every(name => names[name]);
}

function contractStandard(abi: ABIDescription[]) {
  if (isStandard(abi, 'ERC1155')) return 'ERC1155';
  if (isStandard(abi, 'ERC721')) return 'ERC721';
  if (isStandard(abi, 'ERC20')) return 'ERC20';
  return;
}


const TransferID = id('Transfer(address,address,uint256)');
const TransferSingleID = id('TransferSingle(address, address, address, uint256, uint256)');
const TransferBatchId = id('TransferBatch(address, address, address, uint256, uint256)');


function setTransfers(receipts: TransactionReceipt[]) {
  const logs = receipts.map(receipt => receipt.logs).flat();
  for (const log of logs) {
    if (log.topics[0] === TransferID) {
      const account = store.addresses[log.address];
      if (!isContract(account)) continue;
      const artifact = store.artifacts[account.artifact];
      if (artifact.standard === 'ERC20') updateERC20(log);
      if (artifact.standard === 'ERC721') updateERC721(log);
    }
    if (log.topics[0] === TransferSingleID) updateERC1155Single(log);
    if (log.topics[0] === TransferBatchId) updateERC1155Batch(log);
  }
}

function deepUpdate<T>(source: T, fields: string[], cb: (current: any) => void) {
  const key = fields.shift();
  if (fields.length) {
    if (!source[key]) source[key] = {};
    return deepUpdate(source[key], fields, cb);
  }
  source[key] = cb(source[key]);
}

// ERC20
function updateERC20(log: Log) {
  const { blockNumber, address, topics, data } = log;
  const [from] = defaultAbiCoder.decode(['address'], topics[1]);
  const [to] = defaultAbiCoder.decode(['address'], topics[2]);
  const [amount] = defaultAbiCoder.decode(['uint256'], data);
  // Add
  deepUpdate(store.states, [blockNumber, 'erc20', to, address], (current = BigNumber.from(0)) => {
    return current.add(amount);
  });
  // Remove
  if (from === AddressZero) return;
  deepUpdate(store.states, [blockNumber, 'erc20', from, address], (current = BigNumber.from(0)) => {
    return current.sub(amount);
  });
}

// ERC721
function updateERC721(log: Log) {
  const { blockNumber, address, topics, data } = log;
  const [from] = defaultAbiCoder.decode(['address'], topics[1]);
  const [to] = defaultAbiCoder.decode(['address'], topics[2]);
  const [tokenId] = defaultAbiCoder.decode(['uint256'], topics[3]);
  // Add
  deepUpdate(store.states, [blockNumber, 'erc721', to, address], (current = []) => current.push(tokenId));
  // Remove
  if (from === AddressZero) return;
  deepUpdate(store.states, [blockNumber, 'erc721', from, address], (current = []) => {
    return current.filter(id => id !== tokenId);
  });
}

// ERC1155 Single
function updateERC1155Single(log: Log) {
  const { blockNumber, address, topics, data } = log;
  const [from] = defaultAbiCoder.decode(['address'], topics[1]);
  const [to] = defaultAbiCoder.decode(['address'], topics[2]);
  const [tokenId, amount] = defaultAbiCoder.decode(['uint256', 'uint256'], data);
  // Add
  deepUpdate(store.states, [blockNumber, 'erc1155', to, address, tokenId], (current = BigNumber.from(0)) => {
    return current.add(amount);
  });
  // Remove
  if (from === AddressZero) return;
  deepUpdate(store.states, [blockNumber, 'erc1155', from, address, tokenId], (current = BigNumber.from(0)) => {
    return current.sub(amount);
  })
}

// ERC1155 Batch
function updateERC1155Batch(log: Log) {
  const { blockNumber, address, topics, data } = log;
  const [from] = defaultAbiCoder.decode(['address'], topics[1]);
  const [to] = defaultAbiCoder.decode(['address'], topics[2]);
  const [tokenIds, amounts] = defaultAbiCoder.decode(['uint256[]', 'uint256[]'], data);
  // Add
  for (let i = 0; i < tokenIds.length; i++) {
    deepUpdate(store.states, [blockNumber, 'erc1155', to, address, tokenIds[i]], (current = BigNumber.from(0)) => {
      return current.add(amounts[i]);
    })
    if (from === AddressZero) return;
    deepUpdate(store.states, [blockNumber, 'erc1155', from, address, tokenIds[i]], (current = BigNumber.from(0)) => {
      return current.sub(amounts[i]);
    })
  }
}
