import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../../../explorer';

@Component({
  selector: 'explorer-transaction-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  txs$ = this.explorer.txs$;
  constructor(private explorer: BlockExplorer) {}
}
