import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockExplorer } from '../../../explorer';
import { exist } from '../../../utils';
import { combineLatest } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { EthAccount } from '@explorer';

@Component({
  selector: 'explorer-contract-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent {
  address$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('address')),
    filter(exist)
  );

  contract$ = combineLatest([this.explorer.contracts$, this.address$]).pipe(
    map(([addresses, address]) => addresses[address]),
    map(contract => this.populate(contract)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor(
    private explorer: BlockExplorer,
    private route: ActivatedRoute
  ) {}

  private populate(contract: EthAccount) {
    const transactions = contract.transactions.map(hash => this.explorer.get('transactions', hash));
    const abi = this.explorer.source.abis[contract.address];
    return { ...contract, transactions, abi }
  }
}
