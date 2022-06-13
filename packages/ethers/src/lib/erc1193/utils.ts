import type { Chain } from '../chain';
import { AddChainParameter } from './types';

export function fromChain(chain: Chain): AddChainParameter {
  return ({
    chainId: `0x${chain.chainId.toString(16)}`,
    chainName: chain.name,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: chain.rpc,
    blockExplorerUrls: chain.explorers.map(explorer => explorer.url),
    iconUrls: []
  })
}