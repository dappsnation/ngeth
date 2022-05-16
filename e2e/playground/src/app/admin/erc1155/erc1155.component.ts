import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractsManager, ERC1193 } from '@ngeth/ethers';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { BaseContract } from '../../services/manager';

@Component({
  selector: 'ngeth-erc1155',
  templateUrl: './erc1155.component.html',
  styleUrls: ['./erc1155.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Erc1155Component {

  address$: Observable<string> = this.route.params.pipe(
    pluck('address')
  );

  contract$ = combineLatest([
    this.address$,
    this.metamask.chainId$,
  ]).pipe(
    map(([address, chainId]) => this.manager.get(address, chainId))
  );

  isOwner$ = combineLatest([
    this.contract$,
    this.metamask.currentAccount$,
  ]).pipe(
    switchMap(([contract, account]) => contract.isOwner(account))
  );

  ownTokens$ = combineLatest([
    this.contract$,
    this.metamask.currentAccount$,
  ]).pipe(
    switchMap(([contract, account]) => contract.tokensChanges(account))
  );

  constructor(
    private metamask: ERC1193,
    private manager: ContractsManager<BaseContract>,
    private route: ActivatedRoute,
  ) {}

  get contract() {
    const address = this.route.snapshot.paramMap.get('address');
    if (!address) throw new Error('No address found in params');
    if (!this.metamask.chainId) throw new Error('No chainId found');
    return this.manager.get(address, this.metamask.chainId);
  }

}
