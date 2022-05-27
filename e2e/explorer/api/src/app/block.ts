import { Block, TransactionReceipt } from "@ethersproject/abstract-provider";
import { Networkish } from "@ethersproject/networks";
import { BaseProvider, getDefaultProvider } from "@ethersproject/providers";
import { EthState, EthAccount } from '@explorer';
import { Socket } from 'socket.io';


let provider: BaseProvider;
/** All the blocks */
export const blocks: Block[] = [];
/** All transactions recorded by their hash */
export const transactions: Record<string, TransactionReceipt> = {};
/** History of transaction per addresses */
export const addresses: Record<string, EthAccount> = {};
/** State of the network at a specific block */
export const states: EthState[] = [];


//////////
// INIT //
//////////
const hardhatAccounts = [
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
  '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
  '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
  '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
  '0x976ea74026e726554db657fa54763abd0c3a0aa9',
  '0x14dc79964da2c08b23698b3d3cc7ca32193d9955',
  '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f',
  '0xa0ee7a142d267c1f36714e4a8f75612f20a79720',
];

const initAccount = (address: string): EthAccount => ({ address, transactions: [], balance: '0x00' });


async function init() {
  const current = await provider.getBlockNumber();
  for (let i = 0; i < current; i++) {
    provider.getBlock(i).then(registerBlock);
  }
  for (const account of hardhatAccounts) {
    if (!addresses[account]) addresses[account] = initAccount(account);
    const balance = await provider.getBalance(account);
    addresses[account].balance = balance.toHexString();
  }
}


////////////////////
// BLOCK LISTENER //
////////////////////

export function blockListener(network: Networkish = 'http://localhost:8545') {
  const sockets: Record<string, Socket> = {};
  const emit = () => {
    const data = { blocks, transactions, addresses, states };
    Object.values(sockets).forEach(socket => socket.emit('block', data))
  }

  // Start Listening on the node
  console.log('Start listening on Ethereum Network', network);
  provider = getDefaultProvider(network);
  provider.on('block', async (blockNumber: number) => {
    const block = await provider.getBlock(blockNumber);
    await registerBlock(block);
    emit();
  });

  // Initialize the state
  init().then(() => emit());

  // Add a socket when a client connect to it
  return {
    addSocket(socket: Socket) {
      sockets[socket.id] = socket;
      emit();
    }
  }
}

async function registerBlock(block: Block) {
  blocks[block.number] = block;
  const get = block.transactions.map(hash => provider.getTransactionReceipt(hash))
  const txs = await Promise.all(get);
  registerTransactions(txs);
  registerState(block, txs);
}

function registerTransactions(txs: TransactionReceipt[]) {
  for (const tx of txs) {
    transactions[tx.transactionHash] = tx;
    if (!addresses[tx.from]) addresses[tx.from] = initAccount(tx.from);
    addresses[tx.from].transactions.unshift(tx.transactionHash);
    if (!addresses[tx.to]) addresses[tx.to] = initAccount(tx.to);
    addresses[tx.to].transactions.unshift(tx.transactionHash);
  }
}

function registerState(block: Block, txs: TransactionReceipt[]) {
  states[block.number] = states[block.number - 1] ?? { balances: {} };
  const addressesSet = new Set([...txs.map(tx => tx.from), ...txs.map(tx => tx.to)]);
  addressesSet.forEach(async address => {
    const balance = await provider.getBalance(address);
    states[block.number].balances[address] = balance.toHexString();
    // Overwrite last balance
    if (!addresses[address]) addresses[address] = initAccount(address);
    addresses[address].balance = balance.toHexString();
  })
}



//////////////
// CONTRACT //
//////////////
