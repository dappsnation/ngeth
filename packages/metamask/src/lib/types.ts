import type { ERC1193Provider } from '@ngeth/ethers';

export interface MetaMaskProvider extends ERC1193Provider {
  chainId: string;
  networkVersion: string;
  selectedAddress?: string;
}

export interface AddChainParameter {
  /** 0x-prefixed hexadecimal string */
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    /** 2-6 characters long */
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export interface WatchAssetParams {
  /** Type of asset: In the future, other standards will be supported */
  type: 'ERC20';
  options: {
    /** The address of the token contract */
    address: string;
    /** A ticker symbol or shorthand, up to 5 characters */
    symbol: string;
    /** The number of token decimals */
    decimals: number;
    /** A string url of the token logo. If not provided, use blocky */
    image?: string;
  };
}