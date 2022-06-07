import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { Balance, BalanceMulti, GetParams, TxList, BlockMined, BalanceHistory } from "./types";
import { states, addresses, transactions, blocks } from '../block';
import { EthState } from "@explorer";

export function balance({ address, tag }: GetParams<Balance>): string {
  let state: EthState | undefined;
  if (tag === 'latest') {
    state = states[states.length - 1];
  }
  else if (tag === 'earliest') {
    state = states[0];
  }
  else if (tag === 'pending') {
    state = states[states.length - 1]; // same as "lastest" because Hardhat doesn't support pending transaction
  }
  else if (typeof tag === 'string') {
    tag = parseInt(tag, 10); // transform to decimal
    if (isNaN(tag)) throw new Error('Unvalid Value');
  }
  if (typeof tag === 'number') {
    tag = parseInt(tag as any, 10); // make sure this is a decimal
    const index = tag < 0 ? states.length + tag : tag;
    state = states[index];
  }

  const balance = state?.balances[address] ?? '0x00';
  return balance.toString().replace('0x', '');
}

export function balanceMulti({ address, tag }: GetParams<BalanceMulti>): {account: string, balance: string}[] {
  const addresses = address.split(',');
  return addresses.map(account => ({
    account,
    balance: balance({ address: account, tag })
  }));
}

export function txList(params: GetParams<TxList>): TransactionReceipt[] {  
  const {address, startblock = 0, endblock, page, sort = 'asc'} = params;  
  if (!address) throw new Error('Error! Missing or invalid Action name');

  const txs = addresses[address].transactions
    .map(tx => transactions[tx])
    .filter(tx => {
      if (tx.from !== address) return false;
      if (startblock && tx.blockNumber < startblock) return false;
      if (endblock && tx.blockNumber > endblock) return false;
      return true;
    });

  const sorting = {
    asc: (a: TransactionReceipt, b: TransactionReceipt) => a.blockNumber - b.blockNumber,
    desc: (a: TransactionReceipt, b: TransactionReceipt) => b.blockNumber - a.blockNumber
  };
  const sortFn = sorting[sort];    
  const sorted = txs.sort(sortFn);
  if (!params.offset || !page) return sorted;
  const offset = Math.min(params.offset, 10000);
  return sorted.slice(offset*(page-1), offset*page);
}

/** return the list of blocks mined by an address */
export function getMinedBlocks(params: GetParams<BlockMined>) {
  const { address, blocktype, page, offset } = params;
  if (!address) throw new Error('Error! Missing or invalid Action name');

  // No parallel branch on hardhat so no uncles block
  if (blocktype === "uncles") throw new Error('No uncles block on local hardhat network');
  const minedBlocks = blocks
  .filter(block => (block.miner === address))
  .map(minedblock => {
    return { 
      blockNumber: minedblock.number,
      timeStamp: minedblock.timestamp,
      // No reward calculation on hardHat, so blockReward = 0;
      blockReward: 0
    }
  })
  if (!offset || !page) return minedBlocks;
  return minedBlocks.slice(offset*(page-1), offset*page);
}

/** returns the balance of an address at a certain block height */
export function balanceHistory(params: GetParams<BalanceHistory>) {
  const { address, blockno } = params;
  let state: EthState | undefined;
  if (!address || ! blockno) throw new Error('Error! Missing or invalid Action name');

  const balance = state[blockno - 1].balance[address] ?? '0x00';
  return balance.toString().replace('0x', '');
}
