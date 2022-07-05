import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ABIDescription } from '@type/solc';
import { BigNumber } from "ethers";
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
  BlockTransactionCountByNumberRequest
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

//////////////
// ACCOUNTS //
//////////////

async function balance(call: Etherscan, address: string, tag: Tag) {
  const res = await call<string>({ module: 'account', action: 'balance', address, tag });
  return toBigNumber(res);
}

async function balanceMulti(call: Etherscan, addresses: string[], tag: Tag) {
  const address = addresses.join(',');
  const data = await call<BalanceMultiResponse[]>({ module: 'account', action: 'balancemulti', address, tag });
  const res = [];
  for (let i =0; i < data.length; i++) {
    res.push({
      account: data[i].account,
      balance: toBigNumber(data[i].balance),
    })
  }
  return res;
}

function txList(call: Etherscan, address: string, params: Optional<TxListRequest> = {}) {
  return call<TransactionResponse[]>({ module: 'account', action: 'txlist', address, ...params });
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


function tokenTx(call: Etherscan, contractaddress: string, params: Optional<TokenTxRequest>) {
  return call<TransactionResponse[]>({ module: 'account', action: 'tokentx', contractaddress, ...params });
}

function tokenNftTx(call: Etherscan, contractaddress: string, params: Optional<TokenNftTxRequest>) {
  return call<TransactionResponse[]>({ module: 'account', action: 'tokennfttx', contractaddress, ...params });
}

function token1155Tx(call: Etherscan, contractaddress: string, params: Optional<Token1155TxRequest>) {
  return call<TransactionResponse[]>({ module: 'account', action: 'token1155tx', contractaddress, ...params });
}

async function getMinedBlocks(call: Etherscan, address: string, params: Optional<MinedBlockRequest>) {
  const data = await call<MinedBlockResponse[]>({ module: 'account', action: 'getminedblocks', address, ...params });
  const res = [];
  for (let i =0; i<data.length; i++) {
    res.push({
      blockNumber: toNumber(data[i].blockNumber),
      timeStamp: data[i].timeStamp,
      blockReward: toBigNumber(data[i].blockReward)
    })
  }
  return res;
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
    blockNumber: toNumber(res.blockNumber),
    timeStamp: res.timeStamp,
    blockMiner: res.blockMiner,
    blockReward: toBigNumber(res.blockReward),
    uncles: res.uncles,
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
  const data = await call<DailyAvgBlocksizeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocksize',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  const res= [];
  for (let i = 0; i< data.length; i++) {
    res.push({
      URCDate: data[i].UTCDate,
      unixTimeStamp: data[i].unixTimeStamp,
      blockSize_bytes: toNumber(data[i].blockSize_bytes)
    })
  }
  return res;
}

async function dailyBlkCount(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockCountAndRewardRequest>) {
  const data = await call<DailyBlockCountAndRewardResponse[]>({
    module: 'stats',
    action: 'dailyblkcount',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  const res= [];
  for(let i =0; i<data.length; i++) {
    res.push({
      UTCDate: data[i].UTCDate,
      unixTimeStamp: data[i].unixTimeStamp,
      blockCount: toNumber(data[i].blockCount),
      blockRewards_Eth: toBigNumber(data[i].blockRewards_Eth)
    })
  }
  return res;
} 

async function dailyBlockRewards(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockRewardRequest>) {
  const data = await call<DailyBlockRewardResponse[]>({
    module: 'stats',
    action: 'dailyblockrewards',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  const res = [];
  for (let i = 0; i< data.length; i++) {
    res.push({
      URCDate: data[i].UTCDate,
      unixTimeStamp: data[i].unixTimeStamp,
      blockRewards_Eth: toBigNumber(data[i].blockRewards_Eth)
    })
  }
  return res;
}

async function dailyBlockTime(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockTimeRequest>) {
  const data = await call<DailyBlockTimeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocktime',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  const res= [];
  for (let i = 0; i< data.length; i++) {
    res.push({
      URCDate: data[i].UTCDate,
      unixTimeStamp: data[i].unixTimeStamp,
      blockTime_sec: data[i].blockTime_sec
    })
  }
  return res;
}

async function dailyUncleBlkCount(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyUncleBlockCountRequest>) {
  const data = await call<DailyUncleBlockCountReponse[]>({
    module: 'stats',
    action: 'dailyuncleblkcount',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  const res= [];
  for(let i =0; i< data.length; i++) {
    res.push({
      UTCDate: data[i].UTCDate,
      unixTimeStamp: data[i].unixTimeStamp,
      uncleBlockCount: toNumber(data[i].uncleBlockCount),
      uncleBlockRewards_Eth: toBigNumber(data[i].uncleBlockRewards_Eth)
    })
  } 
  return res;
}

//////////
// LOGS //
//////////

function getLogs(call: Etherscan, address: string, params: Optional<LogsRequest>) {
  return call<LogsResponse[]>({ module: 'logs', action: 'getLogs', address, ...params });
}

///////////
// PROXY //
///////////

async function blockNumber(call: Etherscan) {
  return await call<string>({ module: 'proxy', action: 'eth_blockNumber' });
}

function getBlockByNumber(call: Etherscan, tag: ProxyTag, boolean: boolean) {
  if (boolean === true) {
    return call<BlockResponse<TransactionResponse[]>>({ module: 'proxy', action: 'eth_getBlockByNumber', tag, boolean });
  } else {
    return call<BlockResponse<string[]>>({ module: 'proxy', action: 'eth_getBlockByNumber', tag, boolean });
  }
}

function getUncleByBlockNumberAndIndex(call: Etherscan, tag: ProxyTag, params: Optional<UncleByBlockNumberAndIndexRequest>) {
  return call<UncleBlockResponse>({ module: 'proxy', action: 'eth_getUncleByBlockNumberAndIndex', tag, ...params });
}

async function getBlockTransactionCountByNumber(call: Etherscan, params: Optional<BlockTransactionCountByNumberRequest>) {
  return await call<string>({ module: 'proxy', action: 'eth_getBlockTransactionCountByNumber', ...params });
}

function getTransactionByHash(call: Etherscan, txhash: string) {
  return call<TransactionInfosResponse>({ module: 'proxy', action: 'eth_getTransactionByHash', txhash });
}

