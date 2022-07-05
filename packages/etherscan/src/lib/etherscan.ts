import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ABIDescription } from '@type/solc';
import { BigNumber } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { 
  Tag, 
  TxListRequest, 
  TokenTxRequest, 
  TokenNftTxRequest, 
  Token1155TxRequest, 
  MinedBlockRequest,
  Closest,
  DailyAvgBlocksizeRequest,
  DailyBlockCountAndRewardRequest,
  DailyBlockRewardRequest,
  DailyBlockTimeRequest,
  DailyUncleBlockCountRequest,
  LogsRequest,
  UncleByBlockNumberAndIndexRequest,
  ProxyTag,
  BlockTransactionCountByNumberRequest,
  TransactionCount,
  TransactionByBlockNumberAndIndex,
  RawTransaction,
  Call,
  Code,
  EstimateGas,
} from "./type/request";
import {
   BalanceMultiResponse, 
   ContractSourceCodeResponse, 
   MinedBlockResponse,
   BlockRewardResponse,
   BlockCountdownResponse,
   DailyAvgBlocksizeResponse,
   DailyBlockCountAndRewardResponse,
   DailyBlockRewardResponse,
   DailyBlockTimeResponse,
   DailyUncleBlockCountReponse,
   LogsResponse,
   BlockResponse,
   UncleBlockResponse,
   TransactionInfosResponse,
   ExecutionStatusResult,
   StatusResult,
   TxByBlockNumberAndIndexResponse,
   TxReceiptResponse,
   TxListResponse,
   TokenTxResponse,
   TokenNftTxResponse,
   Token1155TxResponse,
  } from "./type/response";

type Etherscan = ReturnType<typeof initEtherscan>;

type OptionalKeys<T> = {
  [K in keyof T]: T extends Record<K, T[K]> ? never : K
}[keyof T];
type OnlyOptionalKeys<T> = Exclude<OptionalKeys<T>, undefined>
type Optional<T> = Pick<T, OnlyOptionalKeys<T>>


function queryParams(params: Record<string, unknown>) {
  return Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
}

function initEtherscan(apiKey: string, baseUrl: string) {
  return <T>(params: Record<string, unknown>): Promise<T> => {
    const query = queryParams({ ...params, apiKey });
    const url = `${baseUrl}?${query}`;
    return fetch(url).then(res => res.json()).then(res => res.result);
  }
}

/** Transform a Date into a YYYY-MM-DD string */
function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}
/** Transform a YYYY-MM-DD string into a Date */
function toDate(date: string) {
  const unixDate = Date.parse(date);
  return new Date(unixDate);
}
/** Transform an Unix timeStamp into a Date */
function unixToDate(timeStamp: string) {
  const sec = parseInt(timeStamp);
  return new Date(sec * 1000);
}
/** Transform a string into a bigNumber */
function toBigNumber(value: string): BigNumber {
  return BigNumber.from(value);
}
/** Transform a string into boolean */
function toBoolean(bool: '0' | '1'): boolean {
  return bool === '0' ? false : true;
}
/** Transform a string into a number */
function toNumber(value: string): number {
  return parseInt(value);
}
/** Transform a hexString into a number */
function hexToNumber(value: string): number {
  return parseInt(value, 16)
}

//////////////
// ACCOUNTS //
//////////////

async function balance(call: Etherscan, address: string, tag: Tag) {
  const res = await call<string>({ module: 'account', action: 'balance', address, tag });
  return toBigNumber(res);
}

async function balanceMulti(call: Etherscan, addresses: string[], tag: Tag) {
  const address = addresses.join(',');
  const res = await call<BalanceMultiResponse[]>({ module: 'account', action: 'balancemulti', address, tag });
  return res.map(data => ({
    account: data.account,
    balance: toBigNumber(data.balance),
  }))
}

function txList(call: Etherscan, address: string, params: Optional<TxListRequest> = {}) {
  return call<TxListResponse[]>({ module: 'account', action: 'txlist', address, ...params });
}

//TODO: Finish the implementation of the 3 `txlistinternal` functions

// function txListInternal(call: Etherscan, txhash: string)
// function txListInternal(call: Etherscan, address: string, params: Optional<TxListInternal>)
// function txListInternal(call: Etherscan, startBlock: number, endBlock: number, params: Optional<TxListInternal>)
// function txListInternal(
//   call: Etherscan,
//   addressOrParams: number | string,
//   paramsOrEndBlock?: number | Optional<TxListInternal>,
//   params: Optional<TxListInternal> = {}
// ): Promise<any[]> {
//   let query: Record<string, unknown>;
//   if (typeof addressOrParams === 'number') {
//     query = { startblock: addressOrParams, endblock: paramsOrEndBlock, ...params };
//   } else if (addressOrParams.length > 42) {
//     query = { txhash: addressOrParams };
//   } else if (typeof paramsOrEndBlock !== 'number') {
//     query = { address: addressOrParams, ...paramsOrEndBlock }
//   }
//   return call<any[]>({ module: 'account', action: 'txlistinternal', ...query });
// }
// const etherscan = initEtherscan('sup', 'sup');
// txListInternal(etherscan, 10, 30)


async function tokenTx(call: Etherscan, contractaddress: string, params: Optional<TokenTxRequest>) {
  const res = await call<TokenTxResponse[]>({ module: 'account', action: 'tokentx', contractaddress, ...params });
  return res.map(data => ({
    ...data,
    blockNumber: toNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    nonce: toNumber(data.nonce),
    value: toNumber(data.value),
    tokenDecimal: toNumber(data.tokenDecimal),
    transactionIndex: toNumber(data.transactionIndex),
    gas: toBigNumber(data.gas),
    gasPrice: toBigNumber(data.gasPrice),
    gasUsed: toBigNumber(data.gasUsed),
    cumulativeGasUsed: toBigNumber(data.cumulativeGasUsed),
    confirmations: toNumber(data.confirmations),
  }))
}

async function tokenNftTx(call: Etherscan, contractaddress: string, params: Optional<TokenNftTxRequest>) {
  const res = await call<TokenNftTxResponse[]>({ module: 'account', action: 'tokennfttx', contractaddress, ...params });
  return res.map(data => ({
    ...data,
    blockNumber: toNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    nonce: toNumber(data.nonce),
    tokenID: toNumber(data.tokenID),
    tokenDecimal: toNumber(data.tokenDecimal),
    transactionIndex: toNumber(data.transactionIndex),
    gas: toBigNumber(data.gas),
    gasPrice: toBigNumber(data.gasPrice),
    gasUsed: toBigNumber(data.gasUsed),
    cumulativeGasUsed: toBigNumber(data.cumulativeGasUsed),
    confirmations: toNumber(data.confirmations),
  }))
}

async function token1155Tx(call: Etherscan, contractaddress: string, params: Optional<Token1155TxRequest>) {
  const res = await call<Token1155TxResponse[]>({ module: 'account', action: 'token1155tx', contractaddress, ...params });
  return res.map(data => ({
    ...data,
    blockNumber: toNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    nonce: toNumber(data.nonce),
    tokenID: toNumber(data.tokenID),
    transactionIndex: toNumber(data.transactionIndex),
    gas: toBigNumber(data.gas),
    gasPrice: toBigNumber(data.gasPrice),
    gasUsed: toBigNumber(data.gasUsed),
    cumulativeGasUsed: toBigNumber(data.cumulativeGasUsed),
    confirmations: toNumber(data.confirmations),
  }))
}

async function getMinedBlocks(call: Etherscan, address: string, params: Optional<MinedBlockRequest>) {
  const res = await call<MinedBlockResponse[]>({ module: 'account', action: 'getminedblocks', address, ...params });
  return res.map(data => ({
    blockNumber: toNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    blockReward: toBigNumber(data.blockReward)
  }))
}

//block no might be optionnal but no testing available since it requires API pro
async function balanceHistory(call: Etherscan, address: string, blockno: number) {
  const res = await call<string>({ module: 'account', action: 'balancehistory', address, blockno });
  return toBigNumber(res)
}

///////////////
// CONTRACTS //
///////////////

//TODO : add `verifysourcecode`, `checkverifystatus`, `verifyproxycontract`, `checkproxyverification`

async function getAbi(call: Etherscan, address: string) {
  const abi = await call<string>({ module: 'contract', action: 'getabi', address });
  return JSON.parse(abi) as ABIDescription[];
}

async function getSourceCode(call: Etherscan, address: string) {
  const data = await call<any[]>({ module: 'contract', action: 'getsourcecode', address });
  return data.map(res => {
    res.ABI = JSON.parse(res.ABI);
    return res as ContractSourceCodeResponse;
  });
}

//////////////////
// TRANSACTIONS //
//////////////////

async function getStatus(call: Etherscan, txhash: string) {
  const res = await call<ExecutionStatusResult>({ module: 'transaction', action: 'getstatus', txhash });
  return {
    isError: toBoolean(res.isError),
    errDescription: res.errDescription
  }
}

async function getTxReceiptStatus(call: Etherscan, txhash: string) {
  const res = await call<StatusResult>({ module: 'transaction', action: 'gettxreceiptstatus', txhash });
  return {
    status: toBoolean(res.status),
  }
}

////////////
// BLOCKS //
////////////

async function getBlockReward(call: Etherscan, blockno: number) {
  const res = await call<BlockRewardResponse>({ module: 'block', action: 'getblockreward', blockno });
  return {
    ...res,
    blockNumber: toNumber(res.blockNumber),
    blockReward: toBigNumber(res.blockReward),
    uncleInclusionReward: toNumber(res.uncleInclusionReward)
  }
}

async function getBlockCountdown(call: Etherscan, blockno: number) {
  const res = await call<BlockCountdownResponse>({ module: 'block', action: 'getblockcountdown', blockno });
  return {
    CurrentBlock: toNumber(res.CurrentBlock),
    CountdownBlock: toNumber(res.CountdownBlock),
    RemainingBlock: toNumber(res.RemainingBlock),
    EstimateTimeInSec: toNumber(res.EstimateTimeInSec),
  }
}

async function getBlocknoByTime(call: Etherscan, timestamp: number, closest: Closest) {
  const res = await call<string>({ module: 'block', action: 'getblocknobytime', timestamp, closest }); 
  return toNumber(res);
}

//////////////////////////
// BLOCKS: STATS MODULE //
//////////////////////////

async function dailyAvgBlockSize(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyAvgBlocksizeRequest>) {
  const res = await call<DailyAvgBlocksizeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocksize',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: toDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    blockSize_bytes: toNumber(data.blockSize_bytes)
  }))
}

async function dailyBlkCount(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockCountAndRewardRequest>) {
  const res = await call<DailyBlockCountAndRewardResponse[]>({
    module: 'stats',
    action: 'dailyblkcount',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: toDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    blockCount: toNumber(data.blockCount),
    blockRewards_Eth: toBigNumber(data.blockRewards_Eth)
  }))
} 

async function dailyBlockRewards(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockRewardRequest>) {
  const res = await call<DailyBlockRewardResponse[]>({
    module: 'stats',
    action: 'dailyblockrewards',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: toDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    blockRewards_Eth: toBigNumber(data.blockRewards_Eth)
  }))
}

async function dailyBlockTime(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockTimeRequest>) {
  const res = await call<DailyBlockTimeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocktime',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: toDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    blockTime_sec: toNumber(data.blockTime_sec)
  }))
}

async function dailyUncleBlkCount(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyUncleBlockCountRequest>) {
  const res = await call<DailyUncleBlockCountReponse[]>({
    module: 'stats',
    action: 'dailyuncleblkcount',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: toDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    uncleBlockCount: toNumber(data.uncleBlockCount),
    uncleBlockRewards_Eth: toBigNumber(data.uncleBlockRewards_Eth)
  }))
}

//////////
// LOGS //
//////////

async function getLogs(call: Etherscan, address: string, params: Optional<LogsRequest>) {
  const res = await call<LogsResponse[]>({ module: 'logs', action: 'getLogs', address, ...params });
  return res.map(data => ({
    ...data,
    blockNumber: hexToNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    gasPrice: hexToNumber(data.gasPrice),
    gasUsed: hexToNumber(data.gasUsed),
    logIndex: hexToNumber(data.logIndex),
    transactionIndex: hexToNumber(data.transactionIndex),
  }))
}

///////////
// PROXY //
///////////

async function blockNumber(call: Etherscan) {
  return await call<string>({ module: 'proxy', action: 'eth_blockNumber' });
}

async function getBlockByNumber(call: Etherscan, tag: ProxyTag, boolean: boolean) {
  if (boolean === true) {
    const res = await call<BlockResponse<TransactionResponse[]>>({ module: 'proxy', action: 'eth_getBlockByNumber', tag, boolean });
    return{
      ...res,
      difficulty: hexToNumber(res.difficulty),
      baseFeePerGas: toBigNumber(res.baseFeePerGas),
      gasLimit: toBigNumber(res.gasLimit),
      gasUsed: toBigNumber(res.gasUsed),
      nonce: hexToNumber(res.nonce),
      number: hexToNumber(res.number),
      size: hexToNumber(res.size),
      timestamp: unixToDate(res.timestamp),
      totalDifficulty: hexToNumber(res.totalDifficulty),
    }
  } else {
    const res = await call<BlockResponse<string[]>>({ module: 'proxy', action: 'eth_getBlockByNumber', tag, boolean });
    return{
      ...res,
      difficulty: hexToNumber(res.difficulty),
      baseFeePerGas: toBigNumber(res.baseFeePerGas),
      gasLimit: toBigNumber(res.gasLimit),
      gasUsed: toBigNumber(res.gasUsed),
      nonce: hexToNumber(res.nonce),
      number: hexToNumber(res.number),
      size: hexToNumber(res.size),
      timestamp: unixToDate(res.timestamp),
      totalDifficulty: hexToNumber(res.totalDifficulty),
    }
  }
}

async function getUncleByBlockNumberAndIndex(call: Etherscan, tag: ProxyTag, params: Optional<UncleByBlockNumberAndIndexRequest>) {
  const res = await call<UncleBlockResponse>({ module: 'proxy', action: 'eth_getUncleByBlockNumberAndIndex', tag, ...params });
  return {
    ...res,
    baseFeePerGas: toBigNumber(res.baseFeePerGas),
    difficulty: hexToNumber(res.difficulty),
    gasLimit: toBigNumber(res.gasLimit),
    gasUsed: toBigNumber(res.gasUsed),
    nonce: hexToNumber(res.nonce),
    number: hexToNumber(res.number),
    size: hexToNumber(res.size),
    timestamp: unixToDate(res.timestamp),
  }
}

async function getBlockTransactionCountByNumber(call: Etherscan, params: Optional<BlockTransactionCountByNumberRequest>) {
  return await call<string>({ module: 'proxy', action: 'eth_getBlockTransactionCountByNumber', ...params });
}

async function getTransactionByHash(call: Etherscan, txhash: string) {
  const res = await call<TransactionInfosResponse>({ module: 'proxy', action: 'eth_getTransactionByHash', txhash });
  return {
    ...res,
    blockNumber: hexToNumber(res.blockNumber),
    gas: toBigNumber(res.gas),
    gasPrice: toBigNumber(res.gasPrice),
    maxFeePerGas: toBigNumber(res.maxFeePerGas),
    maxPriorityFeePerGas: toBigNumber(res.maxPriorityFeePerGas),
    nonce: toNumber(res.nonce),
    transactionIndex: hexToNumber(res.transactionIndex),
    value: toBigNumber(res.value),
    type: hexToNumber(res.type),
    chainId: toNumber(res.chainId),
    v: toNumber(res.v),
  }
}

async function getTransactionByBlockNumberAndIndex(call: Etherscan, tag: ProxyTag, params: Optional<TransactionByBlockNumberAndIndex>) {
  const res = await call<TxByBlockNumberAndIndexResponse>({ module: 'proxy', action: 'eth_getTransactionByBlockNumberAndIndex',tag , ...params});
  return {
    ...res,
    blockNumber: hexToNumber(res.blockNumber),
    chainId: hexToNumber(res.chainId),
    gas: toBigNumber(res.gas),
    gasPrice: toBigNumber(res.gasPrice),
    maxFeePerGas: toBigNumber(res.maxFeePerGas),
    maxPriorityFeePerGas: toBigNumber(res.maxPriorityFeePerGas),
    nonce: hexToNumber(res.nonce),
    transactionIndex: hexToNumber(res.transactionIndex),
    type: hexToNumber(res.type),
    v: hexToNumber(res.v),
    value: toBigNumber(res.value)
  }
}

async function getTransactionCount(call: Etherscan, address: string, params: Optional<TransactionCount>) {
  const res = await call<string>({ module: 'proxy', action: 'eth_getTransactionCount', address, ...params });
  return toNumber(res);
}

async function sendRawTransaction(call: Etherscan, params: RawTransaction) {
  return  await call<string>({ module: 'proxy', action: 'eth_sendRawTransaction', ...params});
}

async function getTransactionReceipt(call: Etherscan, txHash: string) {
  const res = await call<TxReceiptResponse>({ module: 'proxy', action: 'eth_getTransactionReceipt', txHash});
  return {
    ...res,
    blockNumber: hexToNumber(res.blockNumber),
    contractAddress: res.contractAddress,
    cumulativeGasUsed: toBigNumber(res.cumulativeGasUsed),
    effectiveGasPrice: toBigNumber(res.effectiveGasPrice),
    gasUsed: toBigNumber(res.gasUsed),
    status: hexToNumber(res.status),
    transactionIndex: hexToNumber(res.transactionIndex),
    type: hexToNumber(res.type),
  }

}

async function call(call: Etherscan, to: string, params: Optional<Call>) {
  return await call<string>({ module: 'proxy', action: 'eth_call', to, ...params});
}

async function getCode(call: Etherscan, address: string, params: Optional<Code>) {
  return await call<string>({ module: 'proxy', action: 'eth_getCode', address, ...params});
}

async function gasPrice(call: Etherscan) {
  const res = await call<string>({ module: 'proxy', action: 'eth_gasPrice' });
  return toBigNumber(res);
}

async function estimateGas(call: Etherscan, to: string, data: string, params: Optional<EstimateGas>) {
  const res = await call<string>({ module: 'proxy', action: 'eth_estimateGas', to, data, ...params});
  return toBigNumber(res);
}

