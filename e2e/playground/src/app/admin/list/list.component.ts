import { Component, ChangeDetectionStrategy } from '@angular/core';
import { switchMap } from 'rxjs';
import { Factory } from '../../services/factory';


@Component({
  selector: 'ngeth-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {

  contracts$ = this.factory.clones$.pipe(
    switchMap(contracts => Promise.all(contracts.map(c => c.toJSON())))
  );
  
  constructor(
    private factory: Factory
  ) {}
}
