import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../../../explorer';
import { Block } from '@ethersproject/abstract-provider';
import { map } from 'rxjs/operators';

@Component({
  selector: 'explorer-block-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  // Sort mutate the array
  blocks$ = this.explorer.blocks$.pipe(
    map(blocks => [...blocks].sort((a, b) => b.number - a.number))
  );
  trackByBlock = (index: number, block: Block) => block.number;
  constructor(private explorer: BlockExplorer) {}
}
