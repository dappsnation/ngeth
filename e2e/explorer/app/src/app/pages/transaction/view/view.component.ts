import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockExplorer } from '../../../explorer';
import { TransactionReceipt, TransactionResponse, Log } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import { exist } from '../../../utils';
import { combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface TransactionDescription {
  hash: string;
  transactionIndex: number;
  from: string;
  to?: string;
  contractAddress?: string;
  blockNumber: number;
  blockHash: string;
  logs: Log[];
  status: 0 | 1;
  confirmations: number;
  cumulativeGasUsed: BigNumber
  type: number;
  timestamp?: number;
  value: BigNumber;
  nonce: number;
  data: string;
}

function mergeTx(tx: TransactionResponse, receipt: TransactionReceipt): TransactionDescription {
  return {
    hash: receipt.transactionHash,
    transactionIndex: receipt.transactionIndex,
    from: receipt.from,
    to: receipt.to,
    contractAddress: receipt.contractAddress,
    blockNumber: receipt.blockNumber,
    blockHash: receipt.blockHash,
    logs: receipt.logs,
    status: receipt.status as  0 | 1,
    confirmations: receipt.confirmations,
    cumulativeGasUsed: receipt.cumulativeGasUsed,
    type: receipt.type,
    timestamp: tx.timestamp,
    value: tx.value,
    nonce: tx.nonce,
    data: tx.data
  }
}

@Component({
  selector: 'explorer-transaction-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent {
  private hash$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('hash')),
    filter(exist),
  );
  tx$ = combineLatest([
    this.explorer.receipts$,
    this.explorer.txs$,
    this.hash$,
  ]).pipe(
    map(([receipts, txs, hash]) => mergeTx(txs[hash], receipts[hash]))
  );

  showData = false;
  trackByIndex = (i: number) => i;

  constructor(
    private explorer: BlockExplorer,
    private route: ActivatedRoute,
  ) {}
}
