import { Balance, BalanceMulti, GetParams, TxList } from "./types";
import { states, addresses, transactions } from '../block';
import { EthState } from "@explorer";

export function balance({ address, tag }: GetParams<Balance>): string {
  let state: EthState | undefined;
  if (tag === 'latest') {
    state = states[states.length - 1];
  }
  else if (tag === 'earliest') {
    state = states[0];
  }
  else if (tag === 'pending') {
    state = states[states.length - 1]; // same as "lastest" because Hardhat doesn't support pending transaction
  }
  else if (typeof tag === 'string') {
    tag = parseInt(tag, 10); // transform to decimal
    if (isNaN(tag)) throw new Error('Unvalid Value');
  }
  if (typeof tag === 'number') {
    tag = parseInt(tag as any, 10); // make sure this is a decimal
    const index = tag < 0 ? states.length + tag : tag;
    state = states[index];
  }

  const balance = state?.balances[address] ?? '0x00';
  return balance.toString().replace('0x', '');
}

export function balanceMulti({ address, tag }: GetParams<BalanceMulti>): {account: string, balance: string}[] {
  const addresses = address.split(',');
  return addresses.map(account => ({
    account,
    balance: balance({ address: account, tag })
  }));
}

export function txList(params: GetParams<TxList>) {
  const {address, startblock, endblock, page, offset, sort} = params;
  const transaction = addresses[address].transactions
    .map(tx => transactions[tx])
    .filter(tx => tx.from === address)
    .filter(tx => tx.blockNumber >= startblock && tx.blockNumber <= endblock);    

  if (sort === "asc") {
    if(page) {
      return transaction.sort((a, b) => a.blockNumber - b.blockNumber)
      .slice((page*offset), page*(offset + 1));
    }
    else {
      return transaction.sort((a, b) => a.blockNumber - b.blockNumber);
    }        
  }
  if (sort === "desc") {
    if(page) {
      return transaction.sort((a, b) => b.blockNumber - a.blockNumber)
      .slice((page*offset), page*(offset + 1));
    } else {
      return transaction.sort((a, b) => b.blockNumber - a.blockNumber);
    }
  }
}
