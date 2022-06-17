import { BigNumber } from "@ethersproject/bignumber";

export function sum<T>(array: T[], getField: (item: T) => BigNumber | undefined) {
  return array.reduce((total, item) => total.add(getField(item) ?? 0), BigNumber.from(0));
}

