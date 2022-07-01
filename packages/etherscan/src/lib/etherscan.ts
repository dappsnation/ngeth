import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ABIDescription } from '@type/solc';
import { 
  Tag, 
  TxListRequest, 
  TokenTxRequest, 
  TokenNftTxRequest, 
  Token1155TxRequest, 
  MinedBlockRequest,
  Closest,
  DailyAvgBlocksize,
  DailyBlockCountAndReward,
  DailyBlockReward,
  DailyBlockTime,
  DailyUncleBlockCount,
  LogsRequest,
  UncleByBlockNumberAndIndex,
  ProxyTag,
  BlockTransactionCountByNumber
} from "./type/request";
import {
   BalanceMultiResponse, 
   ContractSourceCodeResponse, 
   MinedBlockResponse,
   BlockReward,
   BlockCountdown,
   DailyAvgBlocksizeResponse,
   DailyBlockCountAndRewardResponse,
   DailyBlockRewardResponse,
   DailyBlockTimeResponse,
   DailyUncleBlockCountReponse,
   LogsResponse,
   Block,
   UncleBlock,
   TransactionInfos,
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

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
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
  return call<BlockReward>({ module: 'block', action: 'getblockreward', blockno });
}

function getBlockCountdown(call: Etherscan, blockno: number) {
  return call<BlockCountdown>({ module: 'block', action: 'getblockcountdown', blockno });
}

function getBlocknoByTime(call: Etherscan, timestamp: number, closest: Closest) {
  return call<string>({ module: 'block', action: 'getblocknobytime', timestamp, closest });
}

//////////////////////////
// BLOCKS: STATS MODULE //
//////////////////////////

// TODO : Verify if Date is the correct type
function dailyAvgBlockSize(call: Etherscan, startdate: Date, enddate: Date, params: Optional<DailyAvgBlocksize>) {
  const convertStartDate = formatDate(startdate);
  const convertEndDate = formatDate(enddate);
  return call<DailyAvgBlocksizeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocksize',
    convertStartDate,
    convertEndDate,
    ...params
  });
}

// TODO : Verify if Date is the correct type
function dailyBlkCount(call: Etherscan, startdate: Date, enddate: Date, params: Optional<DailyBlockCountAndReward>) {
  const convertStartDate = formatDate(startdate);
  const convertEndDate = formatDate(enddate);
  return call<DailyBlockCountAndRewardResponse[]>({
    module: 'stats',
    action: 'dailyblkcount',
    convertStartDate,
    convertEndDate,
    ...params
  });
} 

function dailyBlockRewards(call: Etherscan, startdate: Date, enddate: Date, params: Optional<DailyBlockReward>) {
  const convertStartDate = formatDate(startdate);
  const convertEndDate = formatDate(enddate);
  return call<DailyBlockRewardResponse[]>({
    module: 'stats',
    action: 'dailyblockrewards',
    convertStartDate,
    convertEndDate,
    ...params
  });  
}

function dailyBlockTime(call: Etherscan, startdate: Date, enddate: Date, params: Optional<DailyBlockTime>) {
  const convertStartDate = formatDate(startdate);
  const convertEndDate = formatDate(enddate);
  return call<DailyBlockTimeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocktime',
    convertStartDate,
    convertEndDate,
    ...params
  });
}

function dailyUncleBlkCount(call: Etherscan, startdate: Date, enddate: Date, params: Optional<DailyUncleBlockCount>) {
  const convertStartDate = formatDate(startdate);
  const convertEndDate = formatDate(enddate);
  return call<DailyUncleBlockCountReponse[]>({
    module: 'stats',
    action: 'dailyuncleblkcount',
    convertStartDate,
    convertEndDate,
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
    return call<Block<TransactionResponse[]>>({ module: 'proxy', action: 'eth_getBlockByNumber', tag, boolean });
  } else {
    return call<Block<string[]>>({ module: 'proxy', action: 'eth_getBlockByNumber', tag, boolean });
  }
}

function ethGetUncleByBlockNumberAndIndex(call: Etherscan, tag: ProxyTag, params: Optional<UncleByBlockNumberAndIndex>) {
  return call<UncleBlock>({ module: 'proxy', action: 'eth_getUncleByBlockNumberAndIndex', tag, ...params });
}

function getBlockTransactionCountByNumber(call: Etherscan, params: Optional<BlockTransactionCountByNumber>) {
  return call<string>({ module: 'proxy', action: 'eth_getBlockTransactionCountByNumber', ...params });
}

function getTransactionByHash(call: Etherscan, txhash: string) {
  return call<TransactionInfos>({ module: 'proxy', action: 'eth_getTransactionByHash', txhash });
}

