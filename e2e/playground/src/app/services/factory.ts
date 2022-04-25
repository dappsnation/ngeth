import { Injectable } from '@angular/core';
import { ContractsManager, MetaMask } from '@ngeth/ethers';
import { BaseContract } from './manager';
import { switchMap, map } from 'rxjs';
import { ERC1155Factory, addresses } from "../contracts";

// @todo(): currently it only works on a specific chainId
// The factory should update when the the chainId changes

@Injectable({ providedIn: 'root' })
export class Factory extends ERC1155Factory {
  clones$ = this.metamask.currentAccount$.pipe(
    switchMap(account => this.clonesFromAccount(account)),
    map(addresses => addresses.map(address => this.manager.get(address, this.metamask.chainId)))
  );

  constructor(
    private metamask: MetaMask,
    private manager: ContractsManager<BaseContract>,
  ) {
    super(addresses.ERC1155Factory, metamask.getSigner());
  }

  private clonesFromAccount(account: string) {
    const filter = this.filters.Clone(account);
    return this.from(filter).pipe(
      map(events => events.map(event => event.args.clone))
    );
  }
}