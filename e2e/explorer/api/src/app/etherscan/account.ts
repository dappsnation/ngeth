import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { Balance, BalanceMulti, GetParams, TxList, BlockMined } from "./types";
import { store } from '../store';
import { EthState } from "@explorer";

export function balance({ address, tag }: GetParams<Balance>): string {
  let state: EthState | undefined;
  if (tag === 'latest') {
    state = store.states[store.states.length - 1];
  }
  else if (tag === 'earliest') {
    state = store.states[0];
  }
  else if (tag === 'pending') {
    state = store.states[store.states.length - 1]; // same as "lastest" because Hardhat doesn't support pending transaction
  }
  else if (typeof tag === 'string') {
    tag = parseInt(tag, 10); // transform to decimal
    if (isNaN(tag)) throw new Error('Unvalid Value');
  }
  if (typeof tag === 'number') {
    tag = parseInt(tag as any, 10); // make sure this is a decimal
    const index = tag < 0 ? store.states.length + tag : tag;
    state = store.states[index];
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

  const txs = store.addresses[address].transactions
    .map(tx => store.receipts[tx])
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
  const minedBlocks = store.blocks
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
