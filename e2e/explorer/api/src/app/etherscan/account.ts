import { Balance, BalanceMulti, GetParams } from "./types";
import { states, State } from '../block';

export function balance({ address, tag }: GetParams<Balance>): string {
  let state: State | undefined;
  if (tag === 'latest') state = states[states.length - 1]; // .balances[address];
  if (tag === 'earliest') state = states.find(state => address in state.balances); // ?.balances[address];
  if (tag === 'pending') state; // TODO: What is "pending" for ?
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