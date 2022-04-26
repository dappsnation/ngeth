import { inject, Injectable, NgZone } from '@angular/core';
import { MetaMask } from './metamask';
import { WebSigner } from './provider';

@Injectable()
export abstract class ContractsManager<T> {
  private contracts: Record<string, Record<string, T>> = {};
  protected metamask = inject(MetaMask);
  protected zone = inject(NgZone);
  protected signer = inject(WebSigner);

  protected abstract createInstance(address: string): T;

  get(address: string, chainId: number = this.metamask.chainId): T {
    if (!this.contracts[chainId]) this.contracts[chainId] = {};
    if (!this.contracts[chainId][address]) {
      this.contracts[chainId][address] = this.createInstance(address);
    }
    return this.contracts[chainId][address] as T;
  }
}