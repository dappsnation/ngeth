import { Chain } from '../chain/types';
import { toChainHex, toChainId } from '../chain/utils';
import { AddChainParameter } from './types';


export function toAddChain(chain: Chain): AddChainParameter {
  return ({
    chainId: toChainHex(chain.chainId),
    chainName: chain.name,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: chain.rpc,
    blockExplorerUrls: chain.explorers.map(explorer => explorer.url),
    iconUrls: []
  })
}

export function fromAddChain(params: AddChainParameter): Chain {
  return ({
    chainId: toChainId(params.chainId),
    networkId: toChainId(params.chainId),
    name: params.chainName,
    shortName: params.chainName,
    nativeCurrency: params.nativeCurrency,
    rpc: params.rpcUrls,
    explorers: params.blockExplorerUrls?.map(url => ({ url, name: '', standard: 'EIP3091' })) ?? [],
    chain: 'ETH',
    faucets: []
  })
}