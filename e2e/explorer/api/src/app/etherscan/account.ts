import { TransactionReceipt, TransactionResponse, Log } from "@ethersproject/abstract-provider";
import { Balance, BalanceMulti, GetParams, TxList, BlockMined, BalanceHistory, TokenTx, TransferTransaction, ERC1155TransferTransaction, TxListResponse } from "@ngeth/etherscan";
import { store } from '../store';
import { ERC1155Account, ERC20Account, ERC721Account, EthState } from "@explorer";
import { BigNumber } from "@ethersproject/bignumber";
import { id } from "@ethersproject/hash";
import { defaultAbiCoder } from '@ethersproject/abi';
import { sortByBlockNumber } from './utils';


function toTransferTransaction(tx: TransactionResponse, receipt: TransactionReceipt): TransferTransaction {
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
function toTxList(tx: TransactionResponse, receipt: TransactionReceipt): TxListResponse {
  return {
    blockNumber: tx.blockNumber.toString(),
    timeStamp: tx.timestamp.toString(),
    hash: tx.hash,
    nonce: tx.nonce.toString(),
    blockHash: tx.blockHash,
    transactionIndex: receipt.transactionIndex.toString(),
    from: tx.from,
    to: tx.to,
    value: tx.value.toString(),
    gas: tx.gasLimit.toString(),
    gasPrice: receipt.effectiveGasPrice.toString(),
    isError: "0",
    txreceipt_status: "",
    contractAddress: receipt.contractAddress,
    cumulativesGasUsed: receipt.cumulativeGasUsed.toString(),
    gasUsed: receipt.gasUsed.toString() ,
    confirmation: tx.confirmations.toString()
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

export function txList(params: GetParams<TxList>) {  
  const {address, startblock = 0, endblock, page, sort = 'asc'} = params;  
  if (!address) throw new Error('Error! Missing or invalid Action name');

  const txs = store.addresses[address].transactions
    .map(tx => store.receipts[tx])
    .filter(receipt => {
      if(receipt.from !== address) return false
      if (startblock && receipt.blockNumber < startblock) return false;
      if (endblock && receipt.blockNumber > endblock) return false;
      return true;
    })
    .sort(sortByBlockNumber[sort])
    .map(receipt => {
      const tx = store.transactions[receipt.transactionHash];
      return toTxList(tx, receipt)
    })

  if (!params.offset || !page) return txs;
  const offset = Math.min(params.offset, 10000);
  return txs.slice(offset*(page-1), offset*page);
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
        blockNumber: minedblock.number.toString(),
        timeStamp: minedblock.timestamp.toString(),
        // No reward calculation on hardHat, so blockReward = 0;
        blockReward: '0'
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

export function tokensTx(params: GetParams<TokenTx>) {
  const {address, contractaddress, startblock = 0, endblock, page, sort='asc', offset} = params;
  if (!address || !contractaddress) throw new Error('Error! Missing address or contract address');
  
  const transferID = id('Transfer(address,address,uint256)');
  const transferSingleId = id('TransferSingle(address, address, address, uint256, uint256)');
  const transferBatchId = id('TransferBatch(address, address, address, uint256[], uint256[])')

  const etherscanTxs = store.logs[address]
  .filter(log => {
    if(startblock && log.blockNumber < startblock) return false;
    if(endblock && log.blockNumber > endblock) return false;
    if(log.topics[0] !== transferID || log.topics[0] !== transferSingleId || log.topics[0] !== transferBatchId) return false;  
    return true;  
  })
  .sort(sortByBlockNumber[sort])
  .map(log => {
    const receipt = store.receipts[log.transactionHash];
    const tx = store.transactions[log.transactionHash];
    const txTransfer = toTransferTransaction(tx, receipt);
    //ERC20
    if (log.topics[0] === transferID && !log.topics[3]) {
      const metadatas = (store.addresses[address] as ERC20Account).metadata;
      return { 
        ...txTransfer,
        tokenName: metadatas.name,
        tokenDecimal: metadatas.decimals.toString(),
        tokenSymbol: metadatas.symbol 
      };
    }
    //ERC721
    if (log.topics[0] === transferID && log.topics[3]) {
      const metadatas = (store.addresses[address] as ERC721Account).metadata;
      const [id] = defaultAbiCoder.decode(['uint256'], log.topics[3]);
      return {
        ...txTransfer, 
        tokenId: id.toString(), 
        tokenDecimal: metadatas.decimals.toString(),
        tokenName: metadatas.name,
        tokenSymbol: metadatas.symbol 
      };
    }
    //ERC1155
    const toERC1155tx = (id: BigNumber, value: BigNumber): ERC1155TransferTransaction => ({
      ...txTransfer,
      tokenId: id.toString(),
      tokenValue: value.toString(),
      tokenName: (store.addresses[address] as ERC1155Account).metadata.name,
      tokenSymbol: (store.addresses[address] as ERC1155Account).metadata.symbol
    });
    if (log.topics[0] === transferSingleId) {
      const [id, value] = defaultAbiCoder.decode(['uint256', 'uint256' ], log.data);
      return toERC1155tx(id, value)
    } else if (log.topics[0] === transferBatchId) {
      const [ids, values] = defaultAbiCoder.decode(['uint256[]', 'uint256[]'], log.data);
      return ids.map((id, i) => toERC1155tx(id, values[i]));
    }
  })
  .flat()
  
  if (!offset || !page) return etherscanTxs;
  return etherscanTxs.slice(offset*(page-1), offset*page);

}
