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


export interface ERC1193Events {
  accountsChanged: (accounts: string[]) => void;
  chainChanged: (chainId: string) => void;
  connect: (connectInfo: ProviderConnectInfo) => void;
  disconnect: (error: ProviderRpcError) => void;
  message: (message: ProviderMessage) => void;
}


export interface ERC1193Provider {
  chainId?: string;
  networkVersion?: string;
  selectedAddress?: string;
  isConnected(): boolean;
  enable(): Promise<string>;
  send<T>(args: RequestArguments): Promise<T>;
  request<T>(args: RequestArguments): Promise<T>;
  on<K extends keyof ERC1193Events>(
    event: K,
    listener: ERC1193Events[K]
  ): this;
  once<K extends keyof ERC1193Events>(
    event: K,
    listener: ERC1193Events[K]
  ): this;
  addListener<K extends keyof ERC1193Events>(
    event: K,
    listener: ERC1193Events[K]
  ): this;
  removeListener<K extends keyof ERC1193Events>(
    event: K,
    listener: ERC1193Events[K]
  ): this;
  removeAllListeners(event: keyof ERC1193Events): this;
}