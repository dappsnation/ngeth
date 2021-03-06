import { Chain } from '../chain/types';
import { AddChainParameter } from './types';


export function toAddChain(chain: Chain): AddChainParameter {
  return ({
    chainId: `0x${chain.chainId.toString(16)}`,
    chainName: chain.name,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: chain.rpc,
    blockExplorerUrls: chain.explorers.map(explorer => explorer.url),
    iconUrls: []
  })
}