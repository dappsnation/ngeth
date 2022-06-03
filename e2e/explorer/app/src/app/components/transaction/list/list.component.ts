import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { TransactionReceipt } from '@ethersproject/abstract-provider';

@Component({
  selector: 'eth-tx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent{
  @Input() txs: TransactionReceipt[] = [];

}
