import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../../../explorer';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { map } from 'rxjs/operators';

@Component({
  selector: 'explorer-transaction-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  txs$ = this.explorer.receipts$.pipe(
    map(txs => Object.values(txs))
  );
  trackByHash = (index: number, receipt: TransactionReceipt) => receipt.transactionHash;
  constructor(private explorer: BlockExplorer) {}
}
