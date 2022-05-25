import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Provider } from '@ethersproject/providers';
import { combineLatest } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { BlockExplorer } from '../explorer';
import { exist } from '../utils';

@Component({
  selector: 'eth-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
  address$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('address')),
    filter(exist)
  );
  balance$ = combineLatest([this.address$, this.explorer.blockNumber$]).pipe(
    switchMap(([address]) => this.provider.getBalance(address))
  );
  constructor(
    private provider: Provider,
    private explorer: BlockExplorer,
    private route: ActivatedRoute
  ) {}
}
