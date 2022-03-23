import { formatNumber } from "@angular/common";
import { BigNumber, Event } from "ethers";
import { ERC20Metadata } from "./erc20/types";

export function sum<T>(array: T[], getField: (item: T) => BigNumber | undefined) {
  return array.reduce((total, item) => total.add(getField(item) ?? 0), BigNumber.from(0));
}

