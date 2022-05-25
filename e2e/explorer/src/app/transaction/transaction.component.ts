import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Provider } from '@ethersproject/providers';
import { switchMap, map, filter } from 'rxjs/operators';
import { exist } from '../utils';

@Component({
  selector: 'eth-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionComponent {
  tx$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('hash')),
    filter(exist),
    switchMap((hash) => this.provider.getTransaction(hash))
  );

  constructor(private provider: Provider, private route: ActivatedRoute) {}
}
