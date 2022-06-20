import { BigNumber } from '@ethersproject/bignumber';
import { ERC20Metadata } from "./types";
export declare function formatERC20(balance: BigNumber, metadata: ERC20Metadata, digitInfo?: string, locale?: string): string;
export declare function parseERC20(amount: number | string, metadata: ERC20Metadata): BigNumber;
