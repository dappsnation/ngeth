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
  EthereumNodesSizeRequest,
  DailyNetworkTxFeeRequest,
  DailyAvgGasLimitRequest,
  DailyGasUsedRequest,
  DailyAvgGasPriceRequest,
  DailyNewAddressCountRequest,
  DailyNetworkUtilisationRequest,
  DailyAVGNetworkHashRequest,
  DailyTxCountRequest,
  DailyAvgNetworkDifficultyRequest,
  EthDailyHistoricalPriceRequest,
  EthDailyMarketCapRequest,
  TxListInternalByAddressRequest,
  TxListInternalByBlockRangeRequest,
  StorageAtRequest,
} from "./type/request";
import {
   BalanceMultiResponse, 
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
   EthSupply2Response,
   EthPriceResponse,
   EthNodesSizeResponse,
   NodeCountResponse,
   DailyTxFeesResponse,
   DailyNewAddressCountResponse,
   DailyNetworkUtilisationResponse,
   DailyAvgNetworkHahResponse,
   DailyTxCountResponse,
   DailyAvgNetworkDifficultyResponse,
   EthDailyHistoricalPriceResponse,
   EthDailyMarketCapResponse,
   TxListInternalResponse,
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

async  function txListInternalByTxHash(call: Etherscan, txhash: string) {
  const res = await call<TxListInternalResponse[]>({module: 'account', action: 'txlistinternal', txhash});
  return res.map(data => ({
    ...data,
    blockNumber: toNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    value: toBigNumber(data.value),
    gas: toBigNumber(data.gas),
    gasUsed: toBigNumber(data.gasUsed),
    traceId: toNumber(data.traceId),
    isError: toBoolean(data.isError),
  }))
}
async function txListInternalByAddress(call: Etherscan, address: string, params: Optional<TxListInternalByAddressRequest>) {
  const res = await call<TxListInternalResponse[]>({module: 'account', action: 'txlistinternal', address, ...params});
  return res.map(data => ({
    ...data,
    blockNumber: toNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    value: toBigNumber(data.value),
    gas: toBigNumber(data.gas),
    gasUsed: toBigNumber(data.gasUsed),
    traceId: toNumber(data.traceId),
    isError: toBoolean(data.isError),
  }))
}
async function txListInternalByBlockRange(call: Etherscan, startBlock: number, endBlock: number, params: Optional<TxListInternalByBlockRangeRequest>) {
  const res = await call<TxListInternalResponse[]>({module: 'account', action: 'txlistinternal', startBlock , endBlock, ...params});
  return res.map(data => ({
    ...data,
    blockNumber: toNumber(data.blockNumber),
    timeStamp: unixToDate(data.timeStamp),
    value: toBigNumber(data.value),
    gas: toBigNumber(data.gas),
    gasUsed: toBigNumber(data.gasUsed),
    traceId: toNumber(data.traceId),
    isError: toBoolean(data.isError),
  }))
}

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
    tokenValue: toNumber(data.tokenValue),
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

/** Returns the Contract Application Binary Interface ( ABI ) of a verified smart contract. */
async function getAbi(call: Etherscan, address: string) {
  const abi = await call<string>({ module: 'contract', action: 'getabi', address });
  return JSON.parse(abi) as ABIDescription[];
}

/** Returns the Solidity source code of a verified smart contract. */
async function getSourceCode(call: Etherscan, address: string) {
  const data = await call<any[]>({ module: 'contract', action: 'getsourcecode', address });
  return data.map(res => ({
      ...res,
      ABI: JSON.parse(res.ABI),
      OptimizationUsed: toNumber(res.OptimizationUsed),
      Runs: toNumber(res.Runs),
      ConstructorArguments: toNumber(res.ConstructorArguments)
  }));
}

function checkverifystatus(call: Etherscan, guid: string) {
  return call<string>({ module: 'contract', action: 'checkverifystatus', guid });
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
function sendRawTransaction(call: Etherscan, hex: string) {
  return  call<string>({ module: 'proxy', action: 'eth_sendRawTransaction', hex });
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

/** Experimental Endpoint : returns the value from a storage position at a given address. */
async function getStorageAt(call: Etherscan, address: string, params: Optional<StorageAtRequest>) {
  const res = await call<string>({ module: 'proxy', action: 'eth_getStorageAt', address, ...params});
  return toBigNumber(res);
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
async function dailyAvgGasLimit(call: Etherscan, startDate: Date, endDate: Date, params : Optional<DailyAvgGasLimitRequest>) {
  const res = await call<DailyAvgGasLimitResponse[]>({
    module: 'stats',
    action: 'dailyavggaslimit',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: data.unixTimeStamp,
    gasLimit: toBigNumber(data.gasLimit)
  }))
}
/** Returns the total amount of gas used daily for transctions on the Ethereum network. */
async function dailyGasUsed(call: Etherscan, startDate: Date, endDate: Date, params : Optional<DailyGasUsedRequest>) {
  const res = await call<DailyGasUsedResponse[]>({
    module: 'stats',
    action: 'dailyavggaslimit',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: data.unixTimeStamp,
    gasUsed: toBigNumber(data.gasUsed)
  }))
}

/** Returns the daily average gas price used on the Ethereum network. */
async function dailyAvgGasPrice(call: Etherscan, startDate: Date, endDate: Date, params : Optional<DailyAvgGasPriceRequest>) {
  const res = await call<DailyAvgGasPriceResponse[]>({
    module: 'stats',
    action: 'dailyavggaslimit',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: data.unixTimeStamp,
    maxGasPrice_Wei: toNumber(data.maxGasPrice_Wei),
    minGasPrice_Wei: toNumber(data.minGasPrice_Wei),
    avgGasPrice_Wei: toNumber(data.avgGasPrice_Wei),
  }))
}

///////////
// STATS //
///////////

/** Returns the current amount of Ether in circulation excluding ETH2 Staking rewards and EIP1559 burnt fees. */
async function ethSupply(call: Etherscan) {
  const res = await call<string>({ module: 'stats', action: 'ethsupply'});
  return toBigNumber(res);
}

/** Returns the current amount of Ether in circulation, ETH2 Staking rewards and EIP1559 burnt fees statistics. */
async function ethSupply2(call: Etherscan) {
  const res = await call<EthSupply2Response>({ module: 'stats', action: 'ethsupply2'});
  return {
    EthSupply: toBigNumber(res.EthSupply),
    Eth2Staking: toBigNumber(res.Eth2Staking),
    BurntFees: toBigNumber(res.BurntFees),
  }
}
/** Returns the latest price of 1 ETH. */
async function ethPrice(call: Etherscan) {
  const res = await call<EthPriceResponse>({ module: 'stats', action: 'ethprice'});
  return {
    ethbtc: toNumber(res.ethbtc),
    ethbtc_timestamp: toNumber(res.ethbtc_timestamp),
    ethusd: toNumber(res.ethusd),
    ethusd_timestamp: toNumber(res.ethusd_timestamp)
  }
}

/** Returns the size of the Ethereum blockchain, in bytes, over a date range. */
async function ethNodesSize(call: Etherscan, params: Optional<EthereumNodesSizeRequest>) {
  const res = await call<EthNodesSizeResponse[]>({ module: 'stats', action: 'chainsize', ...params});
  return res.map(data =>({
    ...data,
    blockNumber: toNumber(data.blockNumber),
    chainTimeStamp: utcToDate(data.chainTimeStamp),
    chainSize: toNumber(data.chainSize),
  }))
}

/** Returns the total number of discoverable Ethereum nodes. */
async function nodeCount(call: Etherscan) {
  const res = await call<NodeCountResponse>({ module: 'stats', action: 'nodecount'});
  return {
    UTCDate: utcToDate(res.UTCDate),
    TotalNodeCount: toNumber(res.TotalNodeCount),
  }
}

/** Returns the amount of transaction fees paid to miners per day. */
async function dailyNetworkTxFee(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyNetworkTxFeeRequest>) {
  const res = await call<DailyTxFeesResponse[]>({
    module: 'stats',
    action: 'dailytxnfee',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    transactionFee_Eth: toBigNumber(data.transactionFee_Eth)
  }))
}

/** Returns the number of new Ethereum addresses created per day. */
async function dailyNewAddressCount(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyNewAddressCountRequest>) {
  const res = await call<DailyNewAddressCountResponse[]>({
    module: 'stats',
    action: 'dailynewaddress',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    newAddressCount: toNumber(data.newAddressCount)
  }))
}

/** Returns the daily average gas used over gas limit, in percentage. */
async function dailyNetworkUtilisation(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyNetworkUtilisationRequest>) {
  const res = await call<DailyNetworkUtilisationResponse[]>({
    module: 'stats',
    action: 'dailynetutilization',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    networkUtilization: toNumber(data.networkUtilization)
  }))
}

/** Returns the historical measure of processing power of the Ethereum network. */
async function dailyAvgNetworkHash(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyAVGNetworkHashRequest>) {
  const res = await call<DailyAvgNetworkHahResponse[]>({
    module: 'stats',
    action: 'dailyavghashrate',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    networkHashRate: toNumber(data.networkHashRate)
  }))
}

/** Returns the number of transactions performed on the Ethereum blockchain per day. */
async function dailyTxCount(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyTxCountRequest>) {
  const res = await call<DailyTxCountResponse[]>({
    module: 'stats',
    action: 'dailytx',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    transactionCount: toNumber(data.transactionCount)
  }))
}

/** Returns the historical mining difficulty of the Ethereum network. */
async function dailyAvgNetworkDifficulty(call: Etherscan, startDate: Date, endDate: Date, params: Optional<DailyAvgNetworkDifficultyRequest>) {
  const res = await call<DailyAvgNetworkDifficultyResponse[]>({
    module: 'stats',
    action: 'dailynewaddress',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    networkDifficulty: toNumber(data.networkDifficulty)
  }))
}

/** Returns the historical Ether daily market capitalization. */
async function ethDailyMarketCap(call: Etherscan, startDate: Date, endDate: Date, params: Optional<EthDailyMarketCapRequest>) {
  const res = await call<EthDailyMarketCapResponse[]>({
    module: 'stats',
    action: 'dailynewaddress',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    supply: toBigNumber(data.supply),
    marketCap: toNumber(data.marketCap),
    price: toNumber(data.price),
  }))
}

/** Returns the historical price of 1 ETH. */
async function ethDailyHistoricalPrice(call: Etherscan, startDate: Date, endDate: Date, params: Optional<EthDailyHistoricalPriceRequest>) {
  const res = await call<EthDailyHistoricalPriceResponse[]>({
    module: 'stats',
    action: 'dailynewaddress',
    startdate : formatDate(startDate),
    enddate: formatDate(endDate),
    ...params
  });
  return res.map(data => ({
    UTCDate: utcToDate(data.UTCDate),
    unixTimeStamp: toNumber(data.unixTimeStamp),
    value: toBigNumber(data.value)
  }))
}