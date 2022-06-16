import { EvmVersion } from "@type/solc";
import { BigNumber } from "ethers";

export type EtherscanParams = AccountsParams | ContractParams | TransactionParams | StatsParams | TokenParams;

export type Tag = number | 'latest' | 'pending' | 'earliest';
export type Sort = 'asc' | 'desc';
export type Block = 'blocks' | 'uncles';
type Module = 'account' | 'contract' | 'transaction' | 'stats' | 'token' | 'logs';

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
export type AccountsParams = Balance | BalanceMulti | BalanceHistory | TxList | TxListInternal | BlockMined | TokenBalance | TokenBalanceHistory | TokenTx | TokenNftTx | Token1155Tx | MinedBlock;
export interface Balance extends BaseParams<'account', 'balance'> {
  /** the string representing the address to check for balance   */
  address: string;
  /** The integer pre-defined block parameter, either earliest, pending or latest */
  tag: Tag;
}
export interface BalanceMulti extends BaseParams<'account', 'balancemulti'> {
  /** the strings representing the addresses to check for balance, separated by , up to 20 addresses per call */
  address: string;
  /** The integer pre-defined block parameter, either earliest, pending or latest */
  tag: Tag;
}
export interface BalanceHistory extends BaseParams<'account', 'balancehistory'> {
  /** the string representing the address to check for balance */
  address: string;
  /** the integer block number to check balance for eg. 12697906 */
  blockno: number;
}
export interface TxList extends BaseParams<'account', 'txlist'> {
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
export interface TxListInternal extends BaseParams<'account', 'txlistinternal'> {
  /** the strings representing the addresses to check for balance, separated by , up to 20 addresses per call */
  address: string;
  /** the integer block number to start searching for transactions */
  startblock: number;
  /** the integer block number to stop searching for transactions */
  endblock: number;
  /** the integer page number, if pagination is enabled */
  page: number;
  /** the number of transactions displayed per page */
  offset: number;
  /** the sorting preference, use asc to sort by ascending and desc to sort by descendin Tip: Specify a smaller startblock and endblock range for faster search results. */
  sort: Sort;
  /** the string representing the transaction hash to check for internal transactions */
  txhash?: string;

}
export interface BlockMined extends BaseParams<'account', 'getminedblocks'> {
  /** the string representing the address to check for balance */
  address: string;
  /** the string pre-defined block type, either blocks for canonical blocks or uncles for uncle blocks only */
  blocktype?: 'blocks' | 'uncles';
  /** the integer page number, if pagination is enabled */
  page?: number;
  /** the number of transactions displayed per page */
  offset?: number;
}

/** Same interface used for TokenNftTx & Token1155Tx */
export interface BaseTokenTx<action extends string> extends BaseParams<'account', action> {
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

export interface TokenTx extends BaseTokenTx<'tokentx'> {};

export interface TokenNftTx extends BaseTokenTx<'tokennfttx'> {};

export interface Token1155Tx extends BaseTokenTx<'token1155tx'> {};

export interface MinedBlock extends BaseParams<'account', 'getminedblocks'> {
  /** the string representing the address to check for balance */
  address: string;
  /** the string pre-defined block type, either blocks for canonical blocks or uncles for uncle blocks only */
  blocktype?: Block;
  /** the integer page number, if pagination is enabled */
  page?: number;
  /** the number of transactions displayed per page */
  offset?: number;
}

//////////////
// CONTRACT //
//////////////
// Params
export type ContractParams = GetABI | VerifySourceCode;
export interface GetABI {
  module: 'contract';
  action: 'getabi';
  address: string;
  apiKey: string;
}

type LibraryName<T extends number> = {[key in `libraryname${T}`]: string };
type LibraryAddress<T extends number> = {[key in `libraryaddress${T}`]: string };
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


/////////////////
// TRANSACTION //
/////////////////
//logs
export interface Logs extends BaseParams<'logs', "getLogs"> {
  fromBlock: number | "latest";
  toBlock: number | "latest";
  address: string;
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

export interface TransferTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  confirmation: string;
}
export interface ERC20TransferTransaction extends TransferTransaction {
  tokenDecimal: string;
}
export interface ERC721TransferTransaction extends TransferTransaction {
  tokenId: string;
  tokenDecimal: '0';
}
export interface ERC1155TransferTransaction extends TransferTransaction {
  tokenId: string;
  tokenValue: string;
}

// Params
export type TransactionParams = GetStatus | GetTxReceiptStatus;
export interface GetStatus extends BaseParams<'transaction', 'getstatus'> {
  /** the string representing the transaction hash to check the execution status */
  txhash: string;
}
export interface GetTxReceiptStatus extends BaseParams<'transaction', 'gettxreceiptstatus'> {
  /** the string representing the transaction hash to check the execution status */
  txhash: string;
}

// Result
export interface ExecutionStatusResult {
  /** 0: Succeed, 1: Failed */
  isError: 0 | 1;
  errDescription?: string;
}
export interface StatusResult {
  /** 0: Succeed, 1: Failed */
  status: 0 | 1;
}

/////////
//Stats//
/////////

export type StatsParams = TokenSupply | TokenSupplyHistory | EthSupply;

export interface EthSupply extends BaseParams<'stats', 'ethsupply'> { };

/////////
//Token//
/////////

export type TokenParams = TokenInfo;

export interface TokenInfo extends BaseParams<'token', 'tokeninfo'> {
  contractaddress: string;
}

export interface TokenBalance extends BaseParams<'account', 'tokenbalance'> {
  contractaddress: string;
  address: string;
  /** Either the blocknumber in hexadecimal or latest / earliest */
  tag?: string | 'latest' | 'earliest';
}

export interface TokenBalanceHistory extends BaseParams<'account', 'tokenbalancehistory'> {
  contractaddress: string;
  address: string;
  blockno: string;
}

export interface TokenSupply extends BaseParams<'stats', 'tokensupply'> {
  contractaddress: string;
}

export interface TokenSupplyHistory extends BaseParams<'stats', 'tokensupplyhistory'> {
  contractaddress: string;
  blockno: string;
}


