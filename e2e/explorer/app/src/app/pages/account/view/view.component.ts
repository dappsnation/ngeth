import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockExplorer } from '../../../explorer';
import { exist } from '../../../utils';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EthAccount } from '@explorer';

@Component({
  selector: 'explorer-account-view',
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
    map(account => this.populate(account))
  );

  constructor(
    private explorer: BlockExplorer,
    private route: ActivatedRoute
  ) {}

  private populate(account: EthAccount) {
    const receipts = account.transactions.map(hash => this.explorer.source.receipts[hash]);
    return { ...account, receipts }
  }
}
