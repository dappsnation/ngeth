import type { ExternalProvider } from '@ethersproject/providers';

export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}
export interface ConnectInfo {
  chainId: string;
}
export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}
export interface ProviderMessage {
  type: string;
  data: unknown;
}

export interface MetaMaskEvents {
  accountsChanged: (accounts: string[]) => void;
  chainChanged: (chainId: string) => void;
  connect: (connectInfo: ConnectInfo) => void;
  disconnect: (error: ProviderRpcError) => void;
  message: (message: ProviderMessage) => void;
}

export interface MetaMaskProvider extends ExternalProvider {
  chainId: string;
  networkVersion: string;
  selectedAddress?: string;
  isConnected(): boolean;
  enable(): Promise<string>;
  send<T>(args: RequestArguments): Promise<T>;
  request<T>(args: RequestArguments): Promise<T>;
  on<K extends keyof MetaMaskEvents>(
    event: K,
    listener: MetaMaskEvents[K]
  ): this;
  once<K extends keyof MetaMaskEvents>(
    event: K,
    listener: MetaMaskEvents[K]
  ): this;
  addListener<K extends keyof MetaMaskEvents>(
    event: K,
    listener: MetaMaskEvents[K]
  ): this;
  removeListener<K extends keyof MetaMaskEvents>(
    event: K,
    listener: MetaMaskEvents[K]
  ): this;
  removeAllListeners(event: keyof MetaMaskEvents): this;
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
    /** A string url of the token logo */
    image: string;
  };
}