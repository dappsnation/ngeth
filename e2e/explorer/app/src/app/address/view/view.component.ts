import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockExplorer } from '../../explorer';
import { exist } from '../../utils';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'eth-address-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent {
  address$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('address')),
    filter(exist)
  );

  account$ = combineLatest([this.explorer.addresses$, this.address$]).pipe(
    map(([addresses, address]) => addresses[address]),
    map(account => ({
      ...account,
      transactions: account.transactions.map(hash => this.explorer.get('transactions', hash))
    }))
  );

  constructor(
    private explorer: BlockExplorer,
    private route: ActivatedRoute
  ) {}
}
