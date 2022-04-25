import { inject, Injectable, NgZone } from '@angular/core';
import { MetaMask } from './metamask';

@Injectable()
export abstract class ContractsManager<T> {
  private contracts: Record<string, Record<string, T>> = {};
  protected metamask = inject(MetaMask);
  protected zone = inject(NgZone);

  protected abstract create(address: string): T;

  get(address: string, chainId: number = this.metamask.chainId): T {
    if (!this.contracts[chainId]) this.contracts[chainId] = {};
    if (!this.contracts[chainId][address]) {
      this.contracts[chainId][address] = this.create(address);
    }
    return this.contracts[chainId][address] as T;
  }
}