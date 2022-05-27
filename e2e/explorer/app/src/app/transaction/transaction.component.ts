import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { BlockExplorer } from '../explorer';
import { exist } from '../utils';

@Component({
  selector: 'eth-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionComponent {
  private hash$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('hash')),
    filter(exist),
  );
  tx$ = combineLatest([
    this.explorer.txs$,
    this.hash$,
  ]).pipe(
    map(([txs, hash]) => txs[hash])
  )

  constructor(
    private explorer: BlockExplorer,
    private route: ActivatedRoute,
  ) {}
}
