import { Chain, SupportedChains } from "./types";

export function toChainHex(id: string | number) {
  if (typeof id === 'string') return id;
  return `0x${id.toString(16)}`;
}
export function toChainId(id: string | number) {
  if (typeof id === 'number') return id;
  return parseInt(id);
}

export function explore(chain: Chain, search: string) {
  if (!chain.explorers.length) return;
  return `${chain.explorers[0].url}/search?q=${search}`;
}

export function isSupportedChain(chainId: string | number, supportedChains: SupportedChains) {
  if (supportedChains === '*') return true;
  const chainIndex = toChainId(chainId);
  return supportedChains.includes(chainIndex);
}



const chainIds = {
  local: toChainHex(1337),
  hardhat: toChainHex(31337)
}


export const defaultCustomChains: Record<string, Chain> = {
  [chainIds.local]: {
    name: 'Localhost',
    shortName: 'local',
    chain: 'ETH',
    chainId: toChainId(chainIds.local),
    networkId: toChainId(chainIds.local),
    rpc: [],
    faucets: [],
    explorers: [],
    nativeCurrency: {
      name: "Local Test Ether",
      symbol: "ETH",
      decimals: 18
    }
  },
  [chainIds.hardhat]: {
    name: 'Hardhat',
    shortName: 'hardhat',
    chain: 'ETH',
    chainId: toChainId(chainIds.hardhat),
    networkId: toChainId(chainIds.hardhat),
    rpc: [],
    faucets: [],
    explorers: [],
    nativeCurrency: {
      name: "Hardhat Test Ether",
      symbol: "ETH",
      decimals: 18
    }
  }
};
