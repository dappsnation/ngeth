import { Injectable, NgZone } from '@angular/core';
import { Contract } from 'ethers';
import { MetaMask } from '../metamask';
import { ERC1155 } from './erc1155/contract';
import { ERC20 } from './erc20';
import { ERC721 } from './erc721';

@Injectable({ providedIn: 'root' })
export class ContractsManager {
  private contracts: Record<string, Record<string, Contract>> = {};

  constructor(
    private metamask: MetaMask,
    private zone: NgZone
  ) {}

  erc20(address: string) {
    return this.get(address, () => new ERC20(address, this.metamask.getSigner(), this.zone));
  }

  erc721(address: string) {
    return this.get(address, () => new ERC721(address, this.metamask.getSigner(), this.zone));
  }

  erc1155(address: string) {
    return this.get(address, () => new ERC1155(address, this.metamask.getSigner(), this.zone));
  }

  private get<T extends Contract>(address: string, create: () => T): T {
    const chainId = this.metamask.chainId;
    if (!this.contracts[chainId]) this.contracts[chainId] = {};
    if (!this.contracts[chainId][address]) {
      this.contracts[chainId][address] = create();
    }
    return this.contracts[chainId][address] as T;
  }
}