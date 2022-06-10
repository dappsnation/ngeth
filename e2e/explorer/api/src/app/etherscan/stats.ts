import { store } from "../store";
import { BigNumber } from "@ethersproject/bignumber";

export function ethSupply() {
  const account = Object.values(store.addresses);
  const balances = account.map(account => account.balance);
  const totalBalances = balances.reduce((a, b) => BigNumber.from(a).add(b), BigNumber.from(0));
  return totalBalances.toString();
}