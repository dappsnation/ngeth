export type EtherscanParams = AccountsParams | ContractParams;

export type Tag = number | 'latest' | 'pending' | 'earliest';
export type Sort = 'asc' | 'desc';
type Module = 'account' | 'contract';

interface BaseParams<M extends Module, Action> {
  module: M;
  action: Action;
  apiKey: string;
}

export type GetParams<T> = Omit<T, 'module' | 'action' | 'apiKey'>


/////////////
// ACCOUNT //
/////////////

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

export interface ContractParams {
  module: 'contract';
  action: 'getabi';
  address: string;
  apiKey: string;
}