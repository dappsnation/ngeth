import { EvmVersion } from "@type/solc";

export type EtherscanParams = AccountsParams | ContractParams | TransactionParams;

export type Tag = number | 'latest' | 'pending' | 'earliest';
export type Sort = 'asc' | 'desc';
type Module = 'account' | 'contract' | 'transaction';

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
export type AccountsParams = Balance | BalanceMulti | TxList | TxListInternal;
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
export interface TxList extends BaseParams<'account', 'txlist'> {
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