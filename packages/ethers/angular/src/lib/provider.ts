import { getDefaultProvider, Provider } from '@ethersproject/providers';
import { Networkish } from '@ethersproject/networks';

export function rpcProvider(network?: Networkish, options?: any) {
  return { provide: Provider, useFactory: () => getDefaultProvider(network, options) };
}
