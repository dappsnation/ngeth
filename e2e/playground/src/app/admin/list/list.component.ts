import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgERC1193 } from '@ngeth/ethers-angular';
import { map, switchMap } from 'rxjs';
import { addresses } from '../../contracts';
import { FactoryManager } from '../../services/factory';


@Component({
  selector: 'ngeth-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {

  contracts$ = this.metamask.chainId$.pipe(
    map(chainId => this.factoryManager.get(addresses.hardhat.ERC1155Factory, chainId)),
    switchMap(factory => factory.clones$),
    switchMap(contracts => Promise.all(contracts.map(c => c.toJSON())))
  );
  
  constructor(
    private factoryManager: FactoryManager,
    private metamask: NgERC1193
  ) {}
}
