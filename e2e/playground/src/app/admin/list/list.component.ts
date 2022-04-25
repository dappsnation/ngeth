import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MetaMask, ContractsManager } from '@ngeth/ethers';
;
import { combineLatest, map, switchMap } from 'rxjs';
import { ContractCollection } from '../../services/contract.collection';
import { BaseContract } from '../../services/manager';


@Component({
  selector: 'ngeth-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {

  contracts$ = combineLatest([
    this.metamask.currentAccount$,
    this.metamask.chainId$,
  ]).pipe(
    switchMap(([account, chainId]) => this.contractCollection.fromAccount(account, chainId)),
    map(contracts => contracts.map(c => this.manager.get(c.address, c.transaction.chainId))),
    switchMap(contracts => Promise.all(contracts.map(c => c.toJSON())))
  );
  
  constructor(
    private contractCollection: ContractCollection,
    private manager: ContractsManager<BaseContract>,
    private metamask: MetaMask
  ) {}
}
