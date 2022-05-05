import { Injectable, NgZone } from '@angular/core';
import { ContractsManager } from '@ngeth/ethers';
import { MetaMask } from '@ngeth/metamask';
import { Signer } from '@ethersproject/abstract-signer';
import { BaseContract } from './manager';
import { switchMap, map } from 'rxjs';
import { ERC1155Factory } from "../contracts";

export class Factory extends ERC1155Factory {
  clones$ = this.metamask.currentAccount$.pipe(
    switchMap(account => this.clonesFromAccount(account)),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map(addresses => addresses.map(address => this.manager.get(address, this.metamask.chainId!)))
  );

  constructor(
    address: string,
    signer: Signer,
    zone: NgZone,
    private metamask: MetaMask,
    private manager: ContractsManager<BaseContract>,
  ) {
    super(address, signer, zone);
  }

  private clonesFromAccount(account: string) {
    const filter = this.filters.Clone(account);
    return this.from(filter).pipe(
      map(events => events.map(event => event.args.clone))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class FactoryManager extends ContractsManager<Factory> {

  constructor(
    private contractManager: ContractsManager<BaseContract>,
    private metamask: MetaMask,
  ) {
    super();
  }

  protected createInstance(address: string): Factory {
    return new Factory(address, this.signer, this.zone, this.metamask, this.contractManager)
  }
}