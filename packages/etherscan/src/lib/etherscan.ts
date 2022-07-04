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
/** Transform a bigNumber into a string */
function formatBigNumber(bigNumber: BigNumber) {
  return bigNumber.toString();
}
/** Transform a boolean into string; "1": true, "0": false*/
function formatBoolean(bool: boolean) {
 if(bool === true) return "1"
 return "0" 
}
/** Transform a number into a string */
function formatNumber(num: number) {
  return num.toString();
}

//////////////
// ACCOUNTS //
//////////////

function balance(call: Etherscan, address: string, tag: Tag) {
  return call<string>({ module: 'account', action: 'balance', address, tag });
}

function balanceMulti(call: Etherscan, addresses: string[], tag: Tag) {
  const address = addresses.join(',');
  return call<BalanceMultiResponse[]>({ module: 'account', action: 'balancemulti', address, tag });
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

function getMinedBlocks(call: Etherscan, address: string, params: Optional<MinedBlockRequest>) {
  return call<MinedBlockResponse[]>({ module: 'account', action: 'getminedblocks', address, ...params });
}

//block no might be optionnal but no testing available since it requires API pro
function balanceHistory(call: Etherscan, address: string, blockno: number) {
  return call<string>({ module: 'account', action: 'balancehistory', address, blockno });
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

function getStatus(call: Etherscan, txhash: string) {
  return call<ExecutionStatusResult>({ module: 'transaction', action: 'getstatus', txhash });
}

function getTxReceiptStatus(call: Etherscan, txhash: string) {
  return call<StatusResult>({ module: 'transaction', action: 'gettxreceiptstatus', txhash });
}

////////////
// BLOCKS //
////////////

function getBlockReward(call: Etherscan, blockno: number) {
  return call<BlockRewardResponse>({ module: 'block', action: 'getblockreward', blockno });
}

function getBlockCountdown(call: Etherscan, blockno: number) {
  return call<BlockCountdownResponse>({ module: 'block', action: 'getblockcountdown', blockno });
}

function getBlocknoByTime(call: Etherscan, timestamp: number, closest: Closest) {
  return call<string>({ module: 'block', action: 'getblocknobytime', timestamp, closest });
}

//////////////////////////
// BLOCKS: STATS MODULE //
//////////////////////////

function dailyAvgBlockSize(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyAvgBlocksizeRequest>) {
  return call<DailyAvgBlocksizeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocksize',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
}

function dailyBlkCount(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockCountAndRewardRequest>) {
  return call<DailyBlockCountAndRewardResponse[]>({
    module: 'stats',
    action: 'dailyblkcount',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
} 

function dailyBlockRewards(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockRewardRequest>) {
  return call<DailyBlockRewardResponse[]>({
    module: 'stats',
    action: 'dailyblockrewards',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });  
}

function dailyBlockTime(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockTimeRequest>) {
  return call<DailyBlockTimeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocktime',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
}

function dailyUncleBlkCount(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyUncleBlockCountRequest>) {
  return call<DailyUncleBlockCountReponse[]>({
    module: 'stats',
    action: 'dailyuncleblkcount',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
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

function ethBlockNumber(call: Etherscan) {
  return call<string>({ module: 'proxy', action: 'eth_getBlockByNumber' })
}

function ethGetBlockByNumber(call: Etherscan, tag: ProxyTag, boolean: boolean) {
  if (boolean === true) {
    return call<BlockResponse<TransactionResponse[]>>({ module: 'proxy', action: 'eth_getBlockByNumber', tag, boolean });
  } else {
    return call<BlockResponse<string[]>>({ module: 'proxy', action: 'eth_getBlockByNumber', tag, boolean });
  }
}

function ethGetUncleByBlockNumberAndIndex(call: Etherscan, tag: ProxyTag, params: Optional<UncleByBlockNumberAndIndexRequest>) {
  return call<UncleBlockResponse>({ module: 'proxy', action: 'eth_getUncleByBlockNumberAndIndex', tag, ...params });
}

function getBlockTransactionCountByNumber(call: Etherscan, params: Optional<BlockTransactionCountByNumberRequest>) {
  return call<string>({ module: 'proxy', action: 'eth_getBlockTransactionCountByNumber', ...params });
}

function getTransactionByHash(call: Etherscan, txhash: string) {
  return call<TransactionInfosResponse>({ module: 'proxy', action: 'eth_getTransactionByHash', txhash });
}

