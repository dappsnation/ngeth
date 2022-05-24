import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockExplorer } from '../explorer';
import { exist } from '../utils';
import { map, filter, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'eth-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockComponent {
  blockNumber$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('blockNumber')),
    filter(exist),
    map(v => parseInt(v))
  );
  block$ = this.blockNumber$.pipe(
    switchMap(blockNumber => this.explorer.get(blockNumber))
  );
  hasNext$ = combineLatest([
    this.blockNumber$,
    this.explorer.blockNumber$
  ]).pipe(
    map(([current, last]) => current < last)
  );


  constructor(
    private route: ActivatedRoute,
    private explorer: BlockExplorer
  ) {}
}
