import type { BigNumber } from '@ethersproject/bignumber';
export interface ERC20Metadata {
    symbol: string;
    name: string;
    decimals: number;
    totalSupply: BigNumber;
}
