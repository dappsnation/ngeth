import { EvmVersion } from "@type/solc";

export type EtherscanParams = AccountsParams | ContractParams | TransactionParams | StatsParams | TokenParams | LogParams;

export type Tag = number | 'latest' | 'pending' | 'earliest';
export type Sort = 'asc' | 'desc';
export type Block = 'blocks' | 'uncles';
export type Closest = 'before' | 'after';
type Module = 'account' | 'contract' | 'transaction' | 'stats' | 'token' | 'logs' | 'proxy';

interface BaseParams<M extends Module, Action> {
  module: M;
  action: Action;
  apiKey: string;
}

export type GetParams<T> = Omit<T, 'module' | 'action' | 'apiKey'>

/////////////
// ACCOUNT //
/////////////
// Params
export type AccountsParams = BalanceRequest | BalanceMultiRequest | BalanceHistoryRequest | TxListRequest | TxListInternalByAddressRequest| TxListInternalByTxHashRequest | TxListInternalByBlockRangeRequest | MinedBlockRequest | TokenBalanceRequest | TokenBalanceHistoryRequest | TokenTxRequest | TokenNftTxRequest | Token1155TxRequest;

export interface BalanceRequest extends BaseParams<'account', 'balance'> {
  /** the string representing the address to check for balance   */
  address: string;
  /** The integer pre-defined block parameter, either earliest, pending or latest */
  tag: Tag;
}
export interface BalanceMultiRequest extends BaseParams<'account', 'balancemulti'> {
  /** the strings representing the addresses to check for balance, separated by , up to 20 addresses per call */
  address: string;
  /** The integer pre-defined block parameter, either earliest, pending or latest */
  tag: Tag;
}
export interface BalanceHistoryRequest extends BaseParams<'account', 'balancehistory'> {
  /** the string representing the address to check for balance */
  address: string;
  /** the integer block number to check balance for eg. 12697906 */
  blockno: number;
}
export interface TxListRequest extends BaseParams<'account', 'txlist'> {
  /** the strings representing the addresses to check for balance, separated by , up to 20 addresses per call */
  address: string;
  /** the integer block number to start searching for transactions */
  startblock?: number;
  /** the integer block number to stop searching for transactions */
  endblock?: number;
  /** the integer page number, if pagination is enabled */
  page?: number;
  /** the number of transactions displayed per page */
  offset?: number;
  /** the sorting preference, use asc to sort by ascending and desc to sort by descendin Tip: Specify a smaller startblock and endblock range for faster search results. */
  sort?: Sort;
}

export interface TxListInternalByAddressRequest extends BaseParams<'account', 'txlistinternal'> {
  /** the strings representing the addresses to check for balance, separated by , up to 20 addresses per call */
  address: string;
  /** the integer block number to start searching for transactions */
  startblock: number;
  /** the integer block number to stop searching for transactions */
  endblock: number;
  /** the integer page number, if pagination is enabled */
  page?: number;
  /** the number of transactions displayed per page */
  offset?: number;
  /** the sorting preference, use asc to sort by ascending and desc to sort by descendin Tip: Specify a smaller startblock and endblock range for faster search results. */
  sort?: Sort;
}
export interface TxListInternalByTxHashRequest extends BaseParams<'account', 'txlistinternal'> {
  /** the string representing the transaction hash to check for internal transactions */
  txhash?: string;
}
export interface TxListInternalByBlockRangeRequest extends BaseParams<'account', 'txlistinternal'> {
  /** the integer block number to start searching for transactions */
  startblock: number;
  /** the integer block number to stop searching for transactions */
  endblock: number;
  /** the integer page number, if pagination is enabled */
  page?: number;
  /** the number of transactions displayed per page */
  offset?: number;
  /** the sorting preference, use asc to sort by ascending and desc to sort by descendin Tip: Specify a smaller startblock and endblock range for faster search results. */
  sort?: Sort;
}

export interface MinedBlockRequest extends BaseParams<'account', 'getminedblocks'> {
  /** the string representing the address to check for balance */
  address: string;
  /** the string pre-defined block type, either blocks for canonical blocks or uncles for uncle blocks only */
  blocktype?: Block;
  /** the integer page number, if pagination is enabled */
  page?: number;
  /** the number of transactions displayed per page */
  offset?: number;
}
/** Same interface used for TokenNftTx & Token1155Tx */
export interface BaseTokenTxRequest<action extends string> extends BaseParams<'account', action> {
  /** the string representing the token contract address to check for balance */
  contractaddress: string;
  /** the string representing the address to check for balance */
  address?: string;
  /** the integer page number, if pagination is enabled */
  page?: number;
  /** the number of transactions displayed per page */
  offset?: number;
  /** the integer block number to start searching for transactions */
  startblock?: number;
  /** the integer block number to stop searching for transactions */
  endblock?: number;
  /** the sorting preference, use asc to sort by ascending and desc to sort by descending */
  sort?: Sort;
}

export type TokenTxRequest = BaseTokenTxRequest<'tokentx'>;

export type TokenNftTxRequest = BaseTokenTxRequest<'tokennfttx'>;

export type Token1155TxRequest = BaseTokenTxRequest<'token1155tx'>;

//////////////
// CONTRACT //
//////////////
// Params
export type ContractParams = GetABIRequest | VerifySourceCode | GetSourceCodeRequest ;
export interface GetABIRequest extends BaseParams<'contract', 'getabi'> {
  /** the contract address that has a verified source code */
  address: string;
}
export interface GetSourceCodeRequest extends BaseParams<'contract', 'getsourcecode'> {
  /** the contract address that has a verified source code */
  address: string;
}

type LibraryName<T extends number> = { [key in `libraryname${T}`]: string };
type LibraryAddress<T extends number> = { [key in `libraryaddress${T}`]: string };
type Library<T extends number> = Partial<LibraryName<T>> & Partial<LibraryAddress<T>>;

interface VerifySourceCodeParams extends BaseParams<'contract', 'verifysourcecode'> {
  contractaddress: string;
  /** Contract Source Code (Flattened if necessary) */
  sourceCode: string;
  /** solidity-single-file (default) or solidity-standard-json-input (for std-input-json-format support */
  codeformat: 'solidity-single-file' | 'solidity-standard-json-input';
  /** ContractName (if codeformat=solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20) */
  contractname: string;
  /** see https://etherscan.io/solcversions for list of support versions */
  compilerversion: string;
  /** 0 = No Optimization, 1 = Optimization used (applicable when codeformat=solidity-single-file) */
  optimizationUsed: 0 | 1;
  /** set to 200 as default unless otherwise  (applicable when codeformat=solidity-single-file) */
  runs: number;
  /** Arguments used in the constructor of the contract when it has been deployed */
  constructorArguements?: string;
  /** leave blank for compiler default, homestead, tangerineWhistle, spuriousDragon, byzantium, constantinople, petersburg, istanbul (applicable when codeformat=solidity-single-file) */
  evmversion?: EvmVersion;
  /** Valid codes 1-14 see https://etherscan.io/contract-license-types */
  licenseType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
}

export type VerifySourceCode = VerifySourceCodeParams & Library<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>;


//////////
// LOGS //
//////////

export type LogParams = LogsByAddressRequest | LogsByTopicsRequest | LogsRequest;
export interface LogsByAddressRequest extends BaseParams<'logs', "getLogs"> {
  fromBlock?: number | "latest";
  toBlock?: number | "latest";
  address: string;
}

export interface LogsByTopicsRequest extends BaseParams<'logs', "getLogs"> {
  fromBlock: number | "latest";
  toBlock: number | "latest";
  topic0?: string;
  topic1?: string;
  topic2?: string;
  topic3?: string;
  topic0_1_opr?: 'and' | 'or';
  topic0_2_opr?: 'and' | 'or';
  topic0_3_opr?: 'and' | 'or';
  topic1_2_opr?: 'and' | 'or';
  topic1_3_opr?: 'and' | 'or';
  topic2_3_opr?: 'and' | 'or';
}

export interface LogsRequest extends BaseParams <'logs', "getLogs"> {
  address: string;
  fromBlock: number | "latest";
  toBlock: number | "latest";
  topic0?: string;
  topic1?: string;
  topic2?: string;
  topic3?: string;
  topic0_1_opr?: 'and' | 'or';
  topic0_2_opr?: 'and' | 'or';
  topic0_3_opr?: 'and' | 'or';
  topic1_2_opr?: 'and' | 'or';
  topic1_3_opr?: 'and' | 'or';
  topic2_3_opr?: 'and' | 'or';
}

/////////////////
// TRANSACTION //
/////////////////
// Params
export type TransactionParams = GetStatusRequest | GetTxReceiptStatusRequest;
export interface GetStatusRequest extends BaseParams<'transaction', 'getstatus'> {
  /** the string representing the transaction hash to check the execution status */
  txhash: string;
}
export interface GetTxReceiptStatusRequest extends BaseParams<'transaction', 'gettxreceiptstatus'> {
  /** the string representing the transaction hash to check the execution status */
  txhash: string;
}

////////////
// TOKENS //
////////////

export type TokenParams = TokenInfoRequest;

export interface TokenInfoRequest extends BaseParams<'token', 'tokeninfo'> {
  contractaddress: string;
}

export interface TokenBalanceRequest extends BaseParams<'account', 'tokenbalance'> {
  contractaddress: string;
  address: string;
  /** Either the blocknumber in hexadecimal or latest / earliest */
  tag?: string | 'latest' | 'earliest';
}

export interface TokenBalanceHistoryRequest extends BaseParams<'account', 'tokenbalancehistory'> {
  contractaddress: string;
  address: string;
  blockno: string;
}

export interface TokenSupplyRequest extends BaseParams<'stats', 'tokensupply'> {
  contractaddress: string;
}

export interface TokenSupplyHistoryRequest extends BaseParams<'stats', 'tokensupplyhistory'> {
  contractaddress: string;
  blockno: string;
}

////////////
// BLOCKS //
////////////

export interface BaseBlock<action extends string> extends BaseParams<'stats', action> {
  /** the starting date in yyyy-MM-dd format, eg. 2019-02-01 */
  startDate: Date; 
  /** the ending date in yyyy-MM-dd format, eg. 2019-02-28 */
  endDate: Date; 
  /** the sorting preference, use asc to sort by ascending and desc to sort by descending */
  sort?: Sort
}

export type DailyAvgBlocksizeRequest = BaseBlock<'dailyavgblocksize'>;

export type DailyBlockCountAndRewardRequest = BaseBlock<'dailyblkcount'>;

export type DailyBlockRewardRequest = BaseBlock<'dailyblockrewards'>;

export type DailyBlockTimeRequest = BaseBlock<'dailyavgblocktime'>;

export type DailyUncleBlockCountRequest = BaseBlock<'dailyuncleblkcount'>;

///////////
// PROXY //
///////////

export type BlockNumber = BaseParams<'proxy', 'eth_blockNumber'>;

export interface BlockByNumberRequest extends BaseParams<'proxy', 'eth_getBlockByNumber'> {
  /** the block number, in hex  */
  tag: string;
  /** the boolean value to show full transaction objects */
  boolean: boolean;
}

export interface UncleByBlockNumberAndIndexRequest extends BaseParams<'proxy', 'eth_getUncleByBlockNumberAndIndex'>{
  /** the block number, in hex  */
  tag: string;
  /** the position of the uncle's index in the block, in hex  */
  index?: string;
}

/** the block number, in hex  */
export type ProxyTag = string;
/** the position of the uncle's index in the block, in hex */
export type ProxyIndex = string;

export interface BlockTransactionCountByNumberRequest extends BaseParams<'proxy', 'eth_getBlockTransactionCountByNumber'> {
  /** the block number, in hex */
  tag?: string;
}

export interface TransactionByHash extends BaseParams<'proxy', 'eth_getTransactionByHash'> {
  txhash: string;
}

export interface TransactionByBlockNumberAndIndexRequest extends BaseParams<'proxy', 'eth_getTransactionByBlockNumberAndIndex'> {
  tag?: string;
  index?: string;
}

/** Returns the number of transactions performed by an address. */
export interface TransactionCountRequest extends BaseParams<'proxy', 'eth_getTransactionCount'> {
  address: string;
  tag?: string;
}

/** Submits a pre-signed transaction for broadcast to the Ethereum network. */
export interface RawTransactionRequest extends BaseParams<'proxy', 'eth_sendRawTransaction'> {
  hex: string;
}

export interface TxReceiptRequest extends BaseParams<'proxy', 'eth_getTransactionReceipt'> {
  txHash: string;
}

export interface StorageAtRequest extends BaseParams<'proxy', 'eth_getStorageAt'> {
  address: string;
  position?: string;
  tag?: Tag;
}

export interface CallRequest extends BaseParams<'proxy', 'eth_call'> {
  to: string;
  data?: string;
  tag?: string;
}

export interface CodeRequest extends BaseParams<'proxy', 'eth_getCode'> {
  address: string;
  tag?: string;
}
export type GasPrice = BaseParams<'proxy', 'eth_gasPrice'>;

export interface EstimateGasRequest extends BaseParams<'proxy', 'eth_estimateGas'> {
  data: string;
  to: string;
  value?: string;
  gasPrice?: string;
  gas?: string;
}

/////////////////
// GAS TRACKER //
/////////////////
export interface BaseGasTracker<action extends string> extends BaseParams<'stats', action> {
  /** the starting date in yyyy-MM-dd format, eg. 2019-02-01 */
  startDate: Date; 
  /** the ending date in yyyy-MM-dd format, eg. 2019-02-28 */
  endDate: Date; 
  /** the sorting preference, use asc to sort by ascending and desc to sort by descending */
  sort?: Sort
}

export type DailyAvgGasLimitRequest = BaseGasTracker<'dailyavggaslimit'>;

export type DailyGasUsedRequest = BaseGasTracker<'dailygasused'>;

export type DailyAvgGasPriceRequest = BaseGasTracker<'dailyavggasprice'>;



///////////
// STATS //
///////////
export type StatsParams = TokenSupplyRequest | TokenSupplyHistoryRequest | EthSupply | EthereumNodesSizeRequest;

export type EthSupply = BaseParams<'stats', 'ethsupply'>;
export type EthSupply2 = BaseParams<'stats', 'ethsupply2'>;
export type EthLastPrice = BaseParams<'stats', 'ethprice'>;
export type NodeCount = BaseParams<'stats', 'nodecount'>;

export interface EthereumNodesSizeRequest extends BaseParams<'stats', 'chainsize'> {
  startdate: string;
  enddate: string;
  clienttype: string;
  syncmode: string;
  sort: string;
}

export interface BaseStats<action extends string> extends BaseParams<'stats', action> {
  /** the starting date in yyyy-MM-dd format, eg. 2019-02-01 */
  startDate: Date; 
  /** the ending date in yyyy-MM-dd format, eg. 2019-02-28 */
  endDate: Date; 
  /** the sorting preference, use asc to sort by ascending and desc to sort by descending */
  sort?: Sort
}

export type DailyNetworkTxFeeRequest = BaseStats<'dailytxnfee'>;

export type DailyNewAddressCountRequest = BaseStats<'dailynewaddress'>;

export type DailyNetworkUtilisationRequest = BaseStats<'dailynetutilization'>;

export type DailyAVGNetworkHashRequest = BaseStats<'dailyavghashrate'>;

export type DailyTxCountRequest = BaseStats<'dailytx'>;

export type DailyAvgNetworkDifficultyRequest = BaseStats<'dailyavgnetdifficulty'>;

export type EthDailyMarketCapRequest = BaseStats<'ethdailymarketcap'>;

export type EthDailyHistoricalPriceRequest = BaseStats<'ethdailyprice'>;
