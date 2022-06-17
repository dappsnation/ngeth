import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import type { ChainIcon, Chain, SupportedChains, ChainId } from "@ngeth/ethers-core";
import { explore, toChainId, defaultCustomChains, toChainHex } from "@ngeth/ethers-core";
import { Provider } from '@ethersproject/providers';
import { ERC1193 } from "../erc1193";
import { defer,  from } from "rxjs";
import { filter, switchMap } from 'rxjs/operators';

export const CUSTOM_CHAINS = new InjectionToken<Record<string, Chain>>('Custom Chains to use instead of https://github.com/ethereum-lists/chains', {
  providedIn: 'root',
  factory: () => defaultCustomChains
});

export const SUPPORTED_CHAINS = new InjectionToken<SupportedChains>('List of supported chains', {
  providedIn: 'root',
  factory: () => '*'
});

function exist<T>(value?: T | null): value is T {
  return value !== undefined && value !== null;
}

export function getChain(chainId: string | number): Promise<Chain> {
  const id = toChainId(chainId); // transform into decimals
  const url = `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${id}.json`;
  return fetch(url).then(res => res.json());
}

export function getChainIcons(name: string, format?: ChainIcon['format']): Promise<ChainIcon> {
  const url = `https://github.com/ethereum-lists/chains/blob/master/_data/icons/${name}.json`;
  return fetch(url)
    .then(res => res.json())
    .then((icons: ChainIcon[]) => {
      if (!format) return icons[0];
      return icons.find(icon => icon.format === format) ?? icons[0];
    });
}

@Injectable({ providedIn: 'root' })
export class ChainManager {
  private chains: Record<string, Chain> = {};
  private icons: Record<string, ChainIcon> = {};

  chain$ = defer(() => {
    const source = this.erc1193 ? this.erc1193.chainId$ : from(this.currentChain());
    return source;
  }).pipe(
    filter(exist),
    switchMap(chainId => this.getChain(chainId)),
  )

  constructor(
    private provider: Provider,
    @Inject(CUSTOM_CHAINS) private customChains: Record<string, Chain>,
    @Optional() private erc1193?: ERC1193,
  ) {}

  private async currentChain() {
    if (this.erc1193) return this.erc1193.chainId;
    return this.provider.getNetwork().then(network => network.chainId);
  }

  async getChain(chainId?: ChainId): Promise<Chain> {
    chainId = chainId ?? await this.currentChain();
    if (!chainId) throw new Error('No chainId provided');
    const id = toChainHex(chainId);
    if (id in this.customChains) return this.customChains[id];
    if (!this.chains[id]) {
      this.chains[id] = await getChain(id);
    }
    return this.chains[id];
  }

  async getIcon(name: string, format?: ChainIcon['format']) {
    const key = format ? `${name}_${format}` : name;
    if (!this.icons[key]) {
      this.icons[key] = await getChainIcons(name, format);
    }
    return this.icons[key];
  }

  async explore(search: string, chainId?: ChainId) {
    chainId = chainId ?? await this.currentChain();
    if (!chainId) throw new Error('No chainId provided');
    const chain = await this.getChain(chainId);
    return explore(chain, search);
  }
}