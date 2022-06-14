import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Tag, TxList, TxListInternal } from "./types";

interface BalanceMultiResponse {
  account: string;
  balance: string;
}
type Etherscan = ReturnType<typeof initEtherscan>;

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

function balance(call: Etherscan, address: string, tag: Tag) {
  return call<string>({ module: 'account', action: 'balance', address, tag });
}

function balanceMulti(call: Etherscan, addresses: string[], tag: Tag) {
  const address = addresses.join(',');
  return call<BalanceMultiResponse[]>({ module: 'account', action: 'balancemulti', address, tag });
}

function txList(call: Etherscan, address: string, params: Partial<TxList> = {}) {
  return call<TransactionResponse[]>({ module: 'account', action: 'txlist', address, ...params });
}

function txListInternal(call: Etherscan, address: string, params: Partial<TxListInternal> = {}) {
  return call<TransactionResponse[]>({ module: 'account', action: 'txlistinternal', address, ...params })
}

