import { Injectable } from "@angular/core";
import { MetaMask } from "../metamask";
import { ChainIcon, Chain } from "./types";
import { explore, getChain, getChainIcons } from "./utils";
import { switchMap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ChainManager {
  private chains: Record<string, Chain> = {};
  private icons: Record<string, ChainIcon> = {};

  chain$ = this.metamask.chain$.pipe(
    switchMap(chainId => this.getChain(chainId)),
  );

  constructor(private metamask: MetaMask) {}

  async getChain(chainId: string): Promise<Chain> {
    if (!this.chains[chainId]) {
      this.chains[chainId] = await getChain(chainId);
    }
    return this.chains[chainId];
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