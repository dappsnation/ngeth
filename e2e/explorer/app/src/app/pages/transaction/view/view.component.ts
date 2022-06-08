import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockExplorer } from '../../../explorer';
import { exist } from '../../../utils';
import { combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

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
    this.hash$,
  ]).pipe(
    map(([receipts, hash]) => receipts[hash])
  )

  constructor(
    private explorer: BlockExplorer,
    private route: ActivatedRoute,
  ) {}
}
