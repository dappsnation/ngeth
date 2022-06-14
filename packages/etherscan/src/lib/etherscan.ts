import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Tag, TxList, TokenTx, TokenNftTx, Token1155Tx, MinedBlock } from "./types";

interface BalanceMultiResponse {
  account: string;
  balance: string;
}
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
    return fetch(url).then(res => res.json());
  }
}

/////////////
// ACCOUNT //
/////////////

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
  return call<TransactionResponse[]>({ module: 'account', action: 'getminedblocks', address, ...params });
}

//block no might be optionnal but no testing available since it requires API pro
function balanceHistory(call: Etherscan, address: string, blockno: number ) {
  return call<string>({module: 'account', action: 'balancehistory', address, blockno});
}