import { inject, Injectable, Injector, NgZone } from '@angular/core';
// import { WebSigner } from './provider';
import { Signer } from '@ethersproject/abstract-signer';

@Injectable()
export abstract class ContractsManager<T> {
  private contracts: Record<string, Record<string, T>> = {};
  private injector = inject(Injector);
  protected zone = inject(NgZone);
  protected get signer() {
    return this.injector.get(Signer);
  }

  protected abstract createInstance(address: string): T;

  get(address: string, chainId: number): T {
    if (!this.contracts[chainId]) this.contracts[chainId] = {};
    if (!this.contracts[chainId][address]) {
      this.contracts[chainId][address] = this.createInstance(address);
    }
    return this.contracts[chainId][address] as T;
  }
}