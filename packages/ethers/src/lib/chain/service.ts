import { Inject, Injectable, InjectionToken } from "@angular/core";
import { MetaMask } from "../metamask";
import { ChainIcon, Chain, SupportedChains } from "./types";
import { explore, getChain, getChainIcons, defaultCustomChains, toChainId } from "./utils";
import { switchMap } from "rxjs";

export const CUSTOM_CHAINS = new InjectionToken<Record<string, Chain>>('Custom Chains to use instead of https://github.com/ethereum-lists/chains', {
  providedIn: 'root',
  factory: () => defaultCustomChains
});

export const SUPPORTED_CHAINS = new InjectionToken<SupportedChains>('List of supported chains', {
  providedIn: 'root',
  factory: () => '*'
});

@Injectable({ providedIn: 'root' })
export class ChainManager {
  private chains: Record<string, Chain> = {};
  private icons: Record<string, ChainIcon> = {};

  chain$ = this.metamask.chainId$.pipe(
    switchMap(chainId => this.getChain(chainId)),
  );

  constructor(
    private metamask: MetaMask,
    @Inject(CUSTOM_CHAINS) private customChains: Record<string, Chain>
  ) {}

  async getChain(chainId: string | number): Promise<Chain> {
    const id = toChainId(chainId);
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

  async explore(search: string) {
    const chain = await this.getChain(this.metamask.chainId);
    return explore(chain, search);
  }
}