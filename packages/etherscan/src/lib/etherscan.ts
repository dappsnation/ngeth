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
  UncleByBlockNumberAndIndexRequest,
  ProxyTag,
  BlockTransactionCountByNumberRequest,
  TransactionCountRequest,
  TransactionByBlockNumberAndIndexRequest,
  RawTransactionRequest,
  CallRequest,
  CodeRequest,
  EstimateGasRequest,
  TokenBalanceRequest,
  LogsByAddressRequest,
  LogsByTopicsRequest,
  LogsRequest,
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
   TokenInfoResponse,
   GasOracleResponse,
   DailyAvgGasLimitResponse,
   DailyGasUsedResponse,
   DailyAvgGasPriceResponse,
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
function utcToDate(date: string) {
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
function toBoolean(bool: string): boolean {
  return bool === "0" ? false : true;
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

/** Returns the Ether balance of a given address */
async function balance(call: Etherscan, address: string, tag: Tag) {
  const res = await call<string>({ module: 'account', action: 'balance', address, tag });
  return toBigNumber(res);
}

/** Returns the balance of the accounts from a list of addresses. */
async function balanceMulti(call: Etherscan, addresses: string[], tag: Tag) {
  const address = addresses.join(',');
  const res = await call<BalanceMultiResponse[]>({ module: 'account', action: 'balancemulti', address, tag });
  return res.map(data => ({
    account: data.account,
    balance: toBigNumber(data.balance),
  }))
}

/** Returns the list of transactions performed by an address, with optional pagination. */
async function txList(call: Etherscan, address: string, params: Optional<TxListRequest> = {}) {
  const res = await call<TxListResponse[]>({ module: 'account', action: 'txlist', address, ...params });
  return res.map(data => ({
    ...data,
    blockNumber: toNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    nonce: toNumber(data.nonce),
    transactionIndex: toNumber(data.transactionIndex),
    value: toBigNumber(data.value),
    gas: toBigNumber(data.gas),
    gasPrice: toBigNumber(data.gasPrice),
    isError: toBoolean(data.isError),
    txreceipt_status: toBoolean(data.txreceipt_status),
    cumulativesGasUsed: toBigNumber(data.cumulativesGasUsed),
    gasUsed: toBigNumber(data.gasUsed),
    confirmation: toNumber(data.confirmation),
  }))
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

/** Returns the list of ERC-20 tokens transferred by an address, with optional filtering by token contract. */
async function tokenTx(call: Etherscan, contractaddress: string, params: Optional<TokenTxRequest>) {
  const res = await call<TokenTxResponse[]>({ module: 'account', action: 'tokentx', contractaddress, ...params });
  return res.map(data => ({
    ...data,
    blockNumber: toNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    nonce: toNumber(data.nonce),
    value: toBigNumber(data.value),
    tokenDecimal: toNumber(data.tokenDecimal),
    transactionIndex: toNumber(data.transactionIndex),
    gas: toBigNumber(data.gas),
    gasPrice: toBigNumber(data.gasPrice),
    gasUsed: toBigNumber(data.gasUsed),
    cumulativeGasUsed: toBigNumber(data.cumulativeGasUsed),
    confirmations: toNumber(data.confirmations),
  }))
}

/** Returns the list of ERC-721 ( NFT ) tokens transferred by an address, with optional filtering by token contract. */
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

/** Returns the list of ERC-1155 ( Multi Token Standard ) tokens transferred by an address, with optional filtering by token contract. */
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

/** Returns the list of blocks mined by an address. */
async function getMinedBlocks(call: Etherscan, address: string, params: Optional<MinedBlockRequest>) {
  const res = await call<MinedBlockResponse[]>({ module: 'account', action: 'getminedblocks', address, ...params });
  return res.map(data => ({
    blockNumber: toNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    blockReward: toBigNumber(data.blockReward)
  }))
}

/** Returns the balance of an address at a certain block height. */
// block no might be optionnal but no testing available since it requires API pro
async function balanceHistory(call: Etherscan, address: string, blockno: number) {
  const res = await call<string>({ module: 'account', action: 'balancehistory', address, blockno });
  return toBigNumber(res)
}

///////////////
// CONTRACTS //
///////////////

//TODO : add `verifysourcecode`, `checkverifystatus`, `verifyproxycontract`, `checkproxyverification`

/** Returns the Contract Application Binary Interface ( ABI ) of a verified smart contract. */
async function getAbi(call: Etherscan, address: string) {
  const abi = await call<string>({ module: 'contract', action: 'getabi', address });
  return JSON.parse(abi) as ABIDescription[];
}

/** Returns the Solidity source code of a verified smart contract. */
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

/** Returns the status code of a contract execution. */
async function getStatus(call: Etherscan, txhash: string) {
  const res = await call<ExecutionStatusResult>({ module: 'transaction', action: 'getstatus', txhash });
  return {
    isError: toBoolean(res.isError),
    errDescription: res.errDescription
  }
}

/** Returns the status code of a transaction execution. */
async function getTxReceiptStatus(call: Etherscan, txhash: string) {
  const res = await call<StatusResult>({ module: 'transaction', action: 'gettxreceiptstatus', txhash });
  return {
    status: toBoolean(res.status),
  }
}

////////////
// BLOCKS //
////////////

/** Returns the block reward and 'Uncle' block rewards. */
async function getBlockReward(call: Etherscan, blockno: number) {
  const res = await call<BlockRewardResponse>({ module: 'block', action: 'getblockreward', blockno });
  return {
    ...res,
    blockNumber: toNumber(res.blockNumber),
    blockReward: toBigNumber(res.blockReward),
    uncleInclusionReward: toNumber(res.uncleInclusionReward)
  }
}

/** Returns the estimated time remaining, in seconds, until a certain block is mined. */
async function getBlockCountdown(call: Etherscan, blockno: number) {
  const res = await call<BlockCountdownResponse>({ module: 'block', action: 'getblockcountdown', blockno });
  return {
    CurrentBlock: toNumber(res.CurrentBlock),
    CountdownBlock: toNumber(res.CountdownBlock),
    RemainingBlock: toNumber(res.RemainingBlock),
    EstimateTimeInSec: toNumber(res.EstimateTimeInSec),
  }
}

/** Returns the block number that was mined at a certain timestamp. */
async function getBlocknoByTime(call: Etherscan, timestamp: number, closest: Closest) {
  const res = await call<string>({ module: 'block', action: 'getblocknobytime', timestamp, closest }); 
  return toNumber(res);
}

//////////////////////////
// BLOCKS: STATS MODULE //
//////////////////////////

/** Returns the daily average block size within a date range. */
async function dailyAvgBlockSize(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyAvgBlocksizeRequest>) {
  const res = await call<DailyAvgBlocksizeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocksize',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    blockSize_bytes: toNumber(data.blockSize_bytes)
  }))
}

/** Returns the number of blocks mined daily and the amount of block rewards. */
async function dailyBlkCount(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockCountAndRewardRequest>) {
  const res = await call<DailyBlockCountAndRewardResponse[]>({
    module: 'stats',
    action: 'dailyblkcount',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    blockCount: toNumber(data.blockCount),
    blockRewards_Eth: toBigNumber(data.blockRewards_Eth)
  }))
} 

/** Returns the amount of block rewards distributed to miners daily. */
async function dailyBlockRewards(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockRewardRequest>) {
  const res = await call<DailyBlockRewardResponse[]>({
    module: 'stats',
    action: 'dailyblockrewards',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    blockRewards_Eth: toBigNumber(data.blockRewards_Eth)
  }))
}

/** Returns the daily average of time needed for a block to be successfully mined. */
async function dailyBlockTime(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyBlockTimeRequest>) {
  const res = await call<DailyBlockTimeResponse[]>({
    module: 'stats',
    action: 'dailyavgblocktime',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    blockTime_sec: toNumber(data.blockTime_sec)
  }))
}

/** Returns the number of 'Uncle' blocks mined daily and the amount of 'Uncle' block rewards. */
async function dailyUncleBlkCount(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyUncleBlockCountRequest>) {
  const res = await call<DailyUncleBlockCountReponse[]>({
    module: 'stats',
    action: 'dailyuncleblkcount',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    uncleBlockCount: toNumber(data.uncleBlockCount),
    uncleBlockRewards_Eth: toBigNumber(data.uncleBlockRewards_Eth)
  }))
}

//////////
// LOGS //
//////////

/** Returns the event logs from an address, with optional filtering by block range. */
async function getLogsByAddress(call: Etherscan, address: string, params: Optional<LogsByAddressRequest>) {
  const res = await call<LogsResponse[]>({ module: 'logs', action: 'getLogs', address, ...params });
  return res.map(data => ({
    ...data,
    blockNumber: hexToNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    gasPrice: toBigNumber(data.gasPrice),
    gasUsed: toBigNumber(data.gasUsed),
    logIndex: hexToNumber(data.logIndex),
    transactionIndex: hexToNumber(data.transactionIndex),
  }))
}

/** Returns the events log in a block range, filtered by topics.  */
async function getLogsByTopics(call: Etherscan, fromBlock: string, toBlock: string, params: Optional<LogsByTopicsRequest>) {
  const res = await call<LogsResponse[]>({ module: 'logs', action: 'getLogs', fromBlock, toBlock, ...params });
  return res.map(data => ({
    ...data,
    blockNumber: hexToNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    gasPrice: toBigNumber(data.gasPrice),
    gasUsed: toBigNumber(data.gasUsed),
    logIndex: hexToNumber(data.logIndex),
    transactionIndex: hexToNumber(data.transactionIndex),
  }))
}

/** Returns the event logs from an address, filtered by topics and block range. */
async function getLogs(call: Etherscan, fromBlock: string, toBlock: string, address: string, params: Optional<LogsRequest>) {
  const res = await call<LogsResponse[]>({ module: 'logs', action: 'getLogs', fromBlock, toBlock, address, ...params });
  return res.map(data => ({
    ...data,
    blockNumber: hexToNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    gasPrice: toBigNumber(data.gasPrice),
    gasUsed: toBigNumber(data.gasUsed),
    logIndex: hexToNumber(data.logIndex),
    transactionIndex: hexToNumber(data.transactionIndex),
  }))
}

///////////
// PROXY //
///////////

/** Returns the number of most recent block */
async function blockNumber(call: Etherscan) {
  const res = await call<string>({ module: 'proxy', action: 'eth_blockNumber' });
  return hexToNumber(res);
}

/** Returns information about a block by block number. */
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

/** Returns information about a uncle by block number. */
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

/** Returns the number of transactions in a block. */
async function getBlockTransactionCountByNumber(call: Etherscan, params: Optional<BlockTransactionCountByNumberRequest>) {
  const res = await call<string>({ module: 'proxy', action: 'eth_getBlockTransactionCountByNumber', ...params });
  return hexToNumber(res);
}

/** Returns the information about a transaction requested by transaction hash. */
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
  }
}

/** Returns information about a transaction by block number and transaction index position. */
async function getTransactionByBlockNumberAndIndex(call: Etherscan, tag: ProxyTag, params: Optional<TransactionByBlockNumberAndIndexRequest>) {
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
    value: toBigNumber(res.value)
  }
}

/** Returns the number of transactions performed by an address. */
async function getTransactionCount(call: Etherscan, address: string, params: Optional<TransactionCountRequest>) {
  const res = await call<string>({ module: 'proxy', action: 'eth_getTransactionCount', address, ...params });
  return hexToNumber(res);
}

/** Submits a pre-signed transaction for broadcast to the Ethereum network. */
function sendRawTransaction(call: Etherscan, params: RawTransactionRequest) {
  return  call<string>({ module: 'proxy', action: 'eth_sendRawTransaction', ...params});
}

/** Returns the receipt of a transaction by transaction hash. */
async function getTransactionReceipt(call: Etherscan, txHash: string) {
  const res = await call<TxReceiptResponse>({ module: 'proxy', action: 'eth_getTransactionReceipt', txHash});
  return {
    ...res,
    blockNumber: hexToNumber(res.blockNumber),
    cumulativeGasUsed: toBigNumber(res.cumulativeGasUsed),
    effectiveGasPrice: toBigNumber(res.effectiveGasPrice),
    gasUsed: toBigNumber(res.gasUsed),
    status: hexToNumber(res.status),
    transactionIndex: hexToNumber(res.transactionIndex),
    type: hexToNumber(res.type),
  }

}

/** Executes a new message call immediately without creating a transaction on the block chain. */
function call(call: Etherscan, to: string, params: Optional<CallRequest>) {
  return call<string>({ module: 'proxy', action: 'eth_call', to, ...params});
}

/** Returns code at a given address. */
function getCode(call: Etherscan, address: string, params: Optional<CodeRequest>) {
  return call<string>({ module: 'proxy', action: 'eth_getCode', address, ...params});
}

/** Returns the current price per gas in wei. */
async function gasPrice(call: Etherscan) {
  const res = await call<string>({ module: 'proxy', action: 'eth_gasPrice' });
  return toBigNumber(res);
}

/** Makes a call or transaction, which won't be added to the blockchain and returns the used gas. */
async function estimateGas(call: Etherscan, to: string, data: string, params: Optional<EstimateGasRequest>) {
  const res = await call<string>({ module: 'proxy', action: 'eth_estimateGas', to, data, ...params});
  return toBigNumber(res);
}


////////////
// TOKENS //
////////////

/** Returns the current amount of an ERC-20 token in circulation. */
async function tokenSupply(call: Etherscan, contractaddress: string) {
  const res = await call<string>({ module: 'stats', action: 'tokensupply', contractaddress});
  return toBigNumber(res);
}

/** Returns the current balance of an ERC-20 token of an address. */
async function tokenbalance(call: Etherscan, address: string, contractaddress: string, params: Optional<TokenBalanceRequest>) {
  const res = await call<string>({ module: 'account', action: 'tokenbalance', contractaddress, address, ...params});
  return toBigNumber(res);
}

/** Returns the amount of an ERC-20 token in circulation at a certain block height. */
async function  totalSupplyHistory(call: Etherscan, contractaddress: string, blockno: number) {
  const res = await call<string>({ module: 'stats', action: 'tokensupplyhistory', contractaddress, blockno});
  return toBigNumber(res);  
}

/** Returns the balance of an ERC-20 token of an address at a certain block height. */
async function tokenBalanceHistory(call: Etherscan, contractaddress: string, address: string, blockno: number) {
  const res = await call<string>({ module: 'account', action:'tokenbalancehistory', contractaddress, address, blockno});
  return toBigNumber(res);
}

/** Returns project information and social media links of an ERC20/ERC721/ERC1155 token. */
async function tokenInfo(call: Etherscan, contractaddress: string) {
  const res = await call<TokenInfoResponse[]>({module: 'token', action: 'tokeninfo', contractaddress});
  return res.map(data => ({
    ...data,
    totalSupply: toBigNumber(data.totalSupply),
    divisor: toNumber(data.divisor)
  }))
}

/////////////////
// GAS TRACKER //
/////////////////

/** Returns the estimated time, in seconds, for a transaction to be confirmed on the blockchain. */
async function gasTracker(call: Etherscan, gasprice: number) {
  const res = await call<string>({ module: 'gastracker', action: 'gasestimate', gasprice});
  return toNumber(res);
}

/** Returns the current Safe, Proposed and Fast gas prices. */
async function gasOracle(call: Etherscan) {
  const res = await call<GasOracleResponse>({ module: 'gastracker', action: 'gasoracle'});
  return {
    LastBlock: toNumber(res.LastBlock),
    SafeGasPrice:toBigNumber(res.SafeGasPrice),
    ProposeGasPrice: toBigNumber(res.ProposeGasPrice),
    FastGasPrice: toBigNumber(res.FastGasPrice),
    suggestBaseFee: toNumber(res.suggestBaseFee),
    gasUsedRatio: toBigNumber(res.gasUsedRatio),
  }
}

/** Returns the historical daily average gas limit of the Ethereum network. */
async function dailyAvgGasLimit(call: Etherscan, startDate: Date, endDate: Date, sort: string) {
  const res = await call<DailyAvgGasLimitResponse[]>({
    module: 'stats',
    action: 'dailyavggaslimit',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    sort
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: data.unixTimeStamp,
    gasLimit: toBigNumber(data.gasLimit)
  }))
}
/** Returns the total amount of gas used daily for transctions on the Ethereum network. */
async function dailyGasUsed(call: Etherscan, startDate: Date, endDate: Date, sort: string) {
  const res = await call<DailyGasUsedResponse[]>({
    module: 'stats',
    action: 'dailyavggaslimit',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    sort
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: data.unixTimeStamp,
    gasUsed: toBigNumber(data.gasUsed)
  }))
}

/** Returns the daily average gas price used on the Ethereum network. */
async function dailyAvgGasPrice(call: Etherscan, startDate: Date, endDate: Date, sort: string) {
  const res = await call<DailyAvgGasPriceResponse[]>({
    module: 'stats',
    action: 'dailyavggaslimit',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    sort
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: data.unixTimeStamp,
    maxGasPrice_Wei: toNumber(data.maxGasPrice_Wei),
    minGasPrice_Wei: toNumber(data.minGasPrice_Wei),
    avgGasPrice_Wei: toNumber(data.avgGasPrice_Wei),
  }))
}

