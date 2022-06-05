import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ViewComponent } from '../view.component';

@Component({
  selector: 'explorer-contract-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsComponent {
  contract$ = this.shell.contract$;

  constructor(
    private shell: ViewComponent,
  ) { }

}
