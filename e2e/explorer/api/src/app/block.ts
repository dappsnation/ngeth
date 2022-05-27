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


const initAccount = (address: string): EthAccount => ({ address, transactions: [], balance: '0x00' });

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
  const init = async () => {
    const current = await provider.getBlockNumber();
    for (let i = 0; i < current; i++) {
      provider.getBlock(i).then(registerBlock);
    }
  }
  init();

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
    addresses[tx.from].transactions.push(tx.transactionHash);
    if (!addresses[tx.to]) addresses[tx.to] = initAccount(tx.to);
    addresses[tx.to].transactions.push(tx.transactionHash);
  }
}

function registerState(block: Block, txs: TransactionReceipt[]) {
  states[block.number] = states[block.number - 1] ?? { balances: {} };
  const addresses = new Set([...txs.map(tx => tx.from), ...txs.map(tx => tx.to)]);
  addresses.forEach(async address => {
    const balance = await provider.getBalance(address);
    states[block.number].balances[address] = balance.toHexString();
    if (!addresses[address]) addresses[address] = initAccount(address);
    addresses[address].balance = balance;
  })
}



//////////////
// CONTRACT //
//////////////
