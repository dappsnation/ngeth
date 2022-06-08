import { Block, TransactionResponse, TransactionReceipt } from '@ethersproject/abstract-provider';
import { EthAccount, ContractArtifact, ContractAccount, EthStore } from '@explorer';
import { provider } from './provider';

export const store: EthStore = {
  blocks: [],
  states: [],
  transactions: {},
  receipts: {},
  addresses: {},
  logs: {},
  accounts: [],
  contracts: [],
  artifacts: {}
}


///////////
// BLOCK //
///////////

export async function setBlock(block: Block) {
  store.blocks[block.number] = block;
  const getReceipts = block.transactions.map(hash => provider.getTransactionReceipt(hash));
  const getResponses = block.transactions.map(hash => provider.getTransaction(hash));
  const [txs, receipts] = await Promise.all([
    Promise.all(getResponses),
    Promise.all(getReceipts),
  ]);
  await setBlockTransactions(txs, receipts);
  await setState(block, txs);
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
  store.addresses[params.address] =  {
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
export async function addArtifactToAddress(address: string, key: string) {
  if (!store.addresses[address]) await createEthAccount({ address, isContract: true });
  (store.addresses[address] as ContractAccount).artifact = key;
}

/** Store the transaction hash to the addresses involved in the transaction */
async function addTxToAddress(receipt: TransactionReceipt) {
  const addresses = [receipt.from, receipt.to, receipt.contractAddress].filter(address => !!address);
  for (const address of addresses) {
    const isContract = !!receipt.contractAddress;
    if (!store.addresses[address]) await createEthAccount({ address, isContract });
    store.addresses[address].transactions.unshift(receipt.transactionHash);
  }
}

///////////
// STATE //
///////////

/** Set the state of the network at a specific block */
function setState(block: Block, txs: TransactionResponse[]) {
  // Copy previous
  store.states[block.number] = store.states[block.number - 1] ?? { balances: {} };
  // Get unique addresses
  const rawAddresses = [block.miner];
  for (const tx of txs) {
    rawAddresses.push(tx.from);
    if (tx.to) rawAddresses.push(tx.to);
  }
  const addresses = Array.from(new Set(rawAddresses));
  // Get new balance per unique addresses
  const setBalances = addresses.map(async address => {
    const balance = await provider.getBalance(address, block.number);
    store.states[block.number].balances[address] = balance.toString();
  });
  return Promise.all(setBalances);
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
  await addArtifactToAddress(address, artifactKey(artifact));
}