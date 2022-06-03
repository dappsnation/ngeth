import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../../../explorer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'explorer-transaction-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  txs$ = this.explorer.txs$.pipe(
    map(txs => Object.values(txs))
  );
  constructor(private explorer: BlockExplorer) {}
}
