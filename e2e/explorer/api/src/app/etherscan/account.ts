import { Balance, BalanceMulti, GetParams } from "./types";
import { states } from '../block';
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