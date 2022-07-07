import { inject, Injectable, Injector, NgZone } from '@angular/core';
import { Signer } from '@ethersproject/abstract-signer';
import { NgContract } from './contract';

@Injectable()
export abstract class ContractsManager<Base extends NgContract<any>> {
  private contracts: Record<string, Record<string, Base>> = {};
  private injector = inject(Injector);
  protected zone = inject(NgZone);
  protected get signer() {
    return this.injector.get(Signer);
  }

  protected abstract createInstance(address: string): Base;

  get(address: string, chainId: number): Base {
    if (!this.contracts[chainId]) this.contracts[chainId] = {};
    if (!this.contracts[chainId][address]) {
      this.contracts[chainId][address] = this.createInstance(address);
    }
    return this.contracts[chainId][address] as Base;
  }
}