import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MarketContract } from '../market.contract';

@Component({
  selector: 'nxeth-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {

  constructor(private market: MarketContract) { }

}
