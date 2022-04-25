import { Injectable, NgZone } from '@angular/core';
import { ContractsManager, MetaMask } from '@ngeth/ethers';
import { BaseContract } from './manager';
import { switchMap, map } from 'rxjs';
import { ERC1155Factory } from "../contracts";

export class Factory extends ERC1155Factory {
  clones$ = this.metamask.currentAccount$.pipe(
    switchMap(account => this.clonesFromAccount(account)),
    map(addresses => addresses.map(address => this.manager.get(address, this.metamask.chainId)))
  );

  constructor(
    address: string,
    private metamask: MetaMask,
    private manager: ContractsManager<BaseContract>,
    zone: NgZone
  ) {
    super(address, metamask.getSigner(), zone);
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

  constructor(private contractManager: ContractsManager<BaseContract>) {
    super();
  }

  protected create(address: string): Factory {
    return new Factory(address, this.metamask, this.contractManager, this.zone)
  }
}