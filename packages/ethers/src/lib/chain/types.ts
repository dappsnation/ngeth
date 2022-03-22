// See https://github.com/ethereum-lists/chains

export interface Chain {
  name: string;
  shortName: string;
  chain: string;
  chainId: number;
  networkId: number;
  icon: string;
  /** RPC endpoint. Might include ${INFURA_API_KEY} or ${ALCHEMY_API_KEY} */
  rpc: string[];
  faucets: string[];
  nativeCurrency: ChainCurrency;
  infoURL: string;
  slip44: number;
  ens: {
    registry: string;
  },
  explorers: ChainExplorer[];
  parent?: ParentChain;
}

export interface ChainIcon {
  url: string;
  width: number;
  height: number;
  format: 'png' | 'jpg' | 'svg';
}

export interface ChainCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ChainExplorer {
  name: string;
  url: string;
  standard: 'EIP3091'
}

export interface ParentChain {
  type: 'L2',
  chain: string;
  bridges: ChainBridge[];
}

export interface ChainBridge {
  url: string;
}
