export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

export interface ProviderMessage {
  readonly type: string;
  readonly data: unknown;
}

export interface EthSubscription extends ProviderMessage {
  readonly type: 'eth_subscription';
  readonly data: {
    readonly subscription: string;
    readonly result: unknown;
  };
}

export interface ProviderConnectInfo {
  readonly chainId: string;
}


export interface WalletProfile {
  label: string;
  provider: ERC1193Provider;
}

export interface NgERC1193Events {
  accountsChanged: (accounts: string[]) => void;
  chainChanged: (chainId: string) => void;
  connect: (connectInfo: ProviderConnectInfo) => void;
  disconnect: (error: ProviderRpcError) => void;
  message: (message: ProviderMessage) => void;
}


export type NgERC1193Param<K extends keyof NgERC1193Events> = Parameters<NgERC1193Events[K]> extends [infer I]
  ? I
  : Parameters<NgERC1193Events[K]>;

export interface ERC1193Provider {
  chainId?: string;
  networkVersion?: string;
  selectedAddress?: string;
  isConnected(): boolean;
  send<T>(args: RequestArguments): Promise<T>;
  request<T>(args: RequestArguments): Promise<T>;
  on<K extends keyof NgERC1193Events>(
    event: K,
    listener: NgERC1193Events[K]
  ): this;
  once<K extends keyof NgERC1193Events>(
    event: K,
    listener: NgERC1193Events[K]
  ): this;
  addListener<K extends keyof NgERC1193Events>(
    event: K,
    listener: NgERC1193Events[K]
  ): this;
  removeListener<K extends keyof NgERC1193Events>(
    event: K,
    listener: NgERC1193Events[K]
  ): this;
  removeAllListeners(event: keyof NgERC1193Events): this;
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
