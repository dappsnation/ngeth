import type { BigNumber } from "ethers";

export interface ERC20Metadata {
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: BigNumber;
}