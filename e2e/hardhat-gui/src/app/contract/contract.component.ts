import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { exist } from '../utils';

@Component({
  selector: 'eth-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractComponent {
  address$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('address')),
    filter(exist),
  );
  constructor(private route: ActivatedRoute) {}
}
