import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../../../explorer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'explorer-account-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  accounts$ = this.explorer.accounts$.pipe(
    map(record => Object.values(record))
  );
  constructor(private explorer: BlockExplorer) {}
}
