import type { ERC1193Provider } from '@ngeth/ethers-angular';

export interface MetaMaskProvider extends ERC1193Provider {
  chainId: string;
  networkVersion: string;
  selectedAddress?: string;
}


export interface Web3WalletPermission {
    /** The name of the method corresponding to the permission */
    parentCapability: string;
    /** The date the permission was granted, in UNIX epoch time */ 
    date?: number;
}

export interface RequestedPermissions {
  // eslint-disable-next-line @typescript-eslint/ban-types
  eth_accounts: {}; // an empty object, for future extensibility
}