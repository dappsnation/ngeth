import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BlockExplorer } from '../../explorer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'eth-address-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  accounts$ = this.explorer.addresses$.pipe(
    map(addresses => Object.values(addresses))
  );
  constructor(private explorer: BlockExplorer) {}
}
