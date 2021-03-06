import { formatNumber } from "@angular/common";
import { BigNumber } from '@ethersproject/bignumber';
import { ERC20Metadata } from "./types";

export function formatERC20(balance: BigNumber, metadata: ERC20Metadata, digitInfo?: string, locale?: string) {
  const base = BigNumber.from(10).pow(metadata.decimals);
  const amount = balance.div(base);
  const value = formatNumber(amount.toNumber(), locale || 'en', digitInfo);
  return `${value} ${metadata.symbol}`;
}

export function parseERC20(amount: number | string, metadata: ERC20Metadata) {
  const value = typeof amount === 'string' ? parseInt(amount) : amount;
  const base = BigNumber.from(10).pow(metadata.decimals);
  return BigNumber.from(value).mul(base);
}