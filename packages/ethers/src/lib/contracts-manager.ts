import { inject, Injectable, NgZone } from '@angular/core';
import { WebSigner } from './provider';

@Injectable()
export abstract class ContractsManager<T> {
  private contracts: Record<string, Record<string, T>> = {};
  protected zone = inject(NgZone);
  protected signer = inject(WebSigner);

  protected abstract createInstance(address: string): T;

  get(address: string, chainId: number): T {
    if (!this.contracts[chainId]) this.contracts[chainId] = {};
    if (!this.contracts[chainId][address]) {
      this.contracts[chainId][address] = this.createInstance(address);
    }
    return this.contracts[chainId][address] as T;
  }
}