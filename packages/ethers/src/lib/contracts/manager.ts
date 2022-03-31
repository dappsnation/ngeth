import { Injectable, NgZone, Type } from '@angular/core';
import { MetaMask } from '../metamask';

@Injectable()
export abstract class ContractsManager<T> {
  private contracts: Record<string, Record<string, T>> = {};
  protected abstract contractType: Type<T>;

  constructor(
    private metamask: MetaMask,
    private zone: NgZone
  ) {}

  get(address: string, chainId: number): T {
    if (!this.contracts[chainId]) this.contracts[chainId] = {};
    if (!this.contracts[chainId][address]) {
      this.contracts[chainId][address] = new this.contractType(address, this.metamask, this.zone);
    }
    return this.contracts[chainId][address] as T;
  }
}