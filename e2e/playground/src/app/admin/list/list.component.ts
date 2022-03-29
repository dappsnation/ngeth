import { Component, ChangeDetectionStrategy } from '@angular/core';
import { map } from 'rxjs/operators';
import { EthStorage } from '../../storage';

@Component({
  selector: 'nxeth-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {

  contract$ = this.storage.state$.pipe(
    map(state => state.contracts)
  );

  constructor(
    private storage: EthStorage
  ) {}
}
