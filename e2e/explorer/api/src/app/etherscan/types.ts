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
export type AccountsParams = Balance | BalanceMulti | TxList | TxListInternal | BlockMined;
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

//////////////
// CONTRACT //
//////////////
// Params
export type ContractParams = GetABI;
export interface GetABI {
  module: 'contract';
  action: 'getabi';
  address: string;
  apiKey: string;
}


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