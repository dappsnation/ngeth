import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../../../explorer';
import { map } from 'rxjs/operators';
import { EthAccount } from '@explorer';

@Component({
  selector: 'explorer-contract-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  contracts$ = this.explorer.contracts$.pipe(
    map(addresses => Object.values(addresses))
  );
  trackByAddress = (index: number, account: EthAccount) => account.address;
  constructor(private explorer: BlockExplorer) {}
}
