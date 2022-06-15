import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ABIDescription } from '@type/solc';
import {
  Tag,
  TxList,
  TokenTx,
  TokenNftTx,
  Token1155Tx,
  MinedBlock,
  ExecutionStatusResult,
  StatusResult,
  Closest,
  DailyAvgBlocksize,
  DailyBlockCountAndReward,
  DailyBlockReward,
  DailyBlockTime,
  DailyUncleBlockCount
} from "./types";
import { 
  BalanceMultiResponse,
  MinedBlockResponse,
  ContractSourceCode,
  BlockReward,
  BlockCountdown,
  DailyAvgBlocksizeResponse,
  DailyBlockCountAndRewardResponse,
  DailyBlockRewardResponse,
  DailyBlockTimeResponse,
  DailyUncleBlockCountReponse
} from "./response-types";


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

function txList(call: Etherscan, address: string, params: Optional<TxList> = {}) {
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


function tokenTx(call: Etherscan, contractaddress: string, params: Optional<TokenTx>) {
  return call<TransactionResponse[]>({ module: 'account', action: 'tokentx', contractaddress, ...params });
}

function tokenNftTx(call: Etherscan, contractaddress: string, params: Optional<TokenNftTx>) {
  return call<TransactionResponse[]>({ module: 'account', action: 'tokennfttx', contractaddress, ...params });
}

function token1155Tx(call: Etherscan, contractaddress: string, params: Optional<Token1155Tx>) {
  return call<TransactionResponse[]>({ module: 'account', action: 'token1155tx', contractaddress, ...params });
}

function getMinedBlocks(call: Etherscan, address: string, params: Optional<MinedBlock>) {
  return call<MinedBlockResponse[]>({ module: 'account', action: 'getminedblocks', address, ...params });
}

//block no might be optionnal but no testing available since it requires API pro
function balanceHistory(call: Etherscan, address: string, blockno: number) {
  return call<string>({ module: 'account', action: 'balancehistory', address, blockno });
}

///////////////
// CONTRACTS //
///////////////

async function getAbi(call: Etherscan, address: string) {
  const abi = await call<string>({ module: 'contract', action: 'getabi', address });
  return JSON.parse(abi) as ABIDescription[];
}

async function getSourceCode(call: Etherscan, address: string) {
  const data = await call<any[]>({ module: 'contract', action: 'getsourcecode', address });
  return data.map(res => {
    res.ABI = JSON.parse(res.ABI);
    return res as ContractSourceCode
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
  return call<DailyAvgBlocksizeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocksize',
    startdate,
    enddate,
    ...params
  });
}

// TODO : Verify if Date is the correct type
function dailyBlkCount(call: Etherscan, startdate: Date, enddate: Date, params: Optional<DailyBlockCountAndReward>) {
  return call<DailyBlockCountAndRewardResponse[]>({
    module: 'stats',
    action: 'dailyblkcount',
    startdate,
    enddate,
    ...params
  });
}

function dailyBlockRewards(call: Etherscan, startdate: Date, enddate: Date, params: Optional<DailyBlockReward>) {
  return call<DailyBlockRewardResponse[]>({
    module: 'stats',
    action: 'dailyblockrewards',
    startdate,
    enddate,
    ...params
  });
}

function dailyBlockTime(call: Etherscan, startdate: Date, enddate: Date, params: Optional<DailyBlockTime>) {
  return call<DailyBlockTimeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocktime',
    startdate,
    enddate,
    ...params
  });
}

function dailyUncleBlkCount(call: Etherscan, startdate: Date, enddate: Date, params: Optional<DailyUncleBlockCount>) {
  return call<DailyUncleBlockCountReponse[]>({
    module: 'stats',
    action: 'dailyuncleblkcount',
    startdate,
    enddate,
    ...params
  });
}
