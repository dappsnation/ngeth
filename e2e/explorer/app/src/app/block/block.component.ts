import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockExplorer } from '../explorer';
import { exist } from '../utils';
import { map, filter, shareReplay } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'eth-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockComponent {
  blockNumber$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('blockNumber')),
    filter(exist),
    map((v) => parseInt(v))
  );
  private source$ = combineLatest([
    this.explorer.blocks$,
    this.blockNumber$,
  ]).pipe(
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  block$ = this.source$.pipe(
    map(([blocks, current]) => blocks[current])
  );
  hasNext$ = this.source$.pipe(
    map(([blocks, current]) => current < blocks.length - 1)
  );

  constructor(private route: ActivatedRoute, private explorer: BlockExplorer) {}
}
