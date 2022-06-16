import { TransactionReceipt, TransactionResponse, Log } from "@ethersproject/abstract-provider";
import { Balance, BalanceMulti, GetParams, TxList, BlockMined, BalanceHistory, TokenTx, EtherscanTransaction } from "@ngeth/etherscan";
import { store } from '../store';
import { EthState } from "@explorer";
import { BigNumber } from "@ethersproject/bignumber";
import { id } from "@ethersproject/hash";

function toEtherscanTransaction(tx: TransactionResponse, receipt: TransactionReceipt): EtherscanTransaction {
  return {
    blockNumber: tx.blockNumber.toString(),
    timeStamp: tx.timestamp.toString(),
    hash: tx.hash,
    nonce:tx.nonce.toString(),
    blockHash: tx.blockHash,
    from: tx.from,
    contractAddress: receipt.contractAddress,
    to:tx.to,
    value: tx.value.toString(),
    transactionIndex: receipt.transactionIndex.toString(),
    gas: tx.gasLimit.toString(),
    gasPrice: tx.gasPrice.toString(),
    gasUsed: receipt.gasUsed.toString(),
    cumulativeGasUsed: receipt.cumulativeGasUsed.toString(),
    confirmation: tx.confirmations.toString(),
  }
}

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

  const balance = state?.balances[address] ?? BigNumber.from(0);
  return balance.toString();
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

/** returns the balance of an address at a certain block height */
export function balanceHistory(params: GetParams<BalanceHistory>) {
  const { address, blockno } = params;
  if (!address || ! blockno) throw new Error('Error! Missing or invalid Action name');

  const balance = store.states[blockno]?.balances[address];
  if (!balance) return '0';
  return balance.toString();
}

export function tokenTx(params: GetParams<TokenTx>) {
  const {address, contractaddress, startblock = 0, endblock, page, sort='asc', offset} = params;
  if (!address || !contractaddress) throw new Error('Error! Missing address or contract address');
  
  const transferID = id('Transfer(address,address,uint256)');
  const sorting = {
    asc: (a: Log, b: Log) => a.blockNumber - b.blockNumber,
    desc: (a: Log, b: Log) => b.blockNumber - a.blockNumber
  };  

  const etherscanTxs = store.logs[address]
    .filter(log => {
      if (startblock && log.blockNumber < startblock) return false;
      if (endblock && log.blockNumber > endblock) return false;
      if (log.topics[0] !== transferID) return false;
      return true;
    })
    .sort(sorting[sort])
    .map(log => log.transactionHash)
    .map(hash => toEtherscanTransaction(store.transactions[hash], store.receipts[hash]));

  if (!params.offset || !page) return etherscanTxs;
  return etherscanTxs.slice(offset*(page-1), offset*page);
}
