import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../../../explorer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'explorer-block-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  blocks$ = this.explorer.blocks$.pipe(
    map(blocks => blocks.reverse())
  );
  constructor(private explorer: BlockExplorer) {}
}
