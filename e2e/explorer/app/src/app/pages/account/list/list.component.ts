import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../../../explorer';
import { map } from 'rxjs/operators';
import { EthAccount } from '@explorer';

@Component({
  selector: 'explorer-account-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  accounts$ = this.explorer.accounts$.pipe(
    map(record => Object.values(record))
  );
  trackByAddress = (index: number, account: EthAccount) => account.address;
  constructor(private explorer: BlockExplorer) {}
}
