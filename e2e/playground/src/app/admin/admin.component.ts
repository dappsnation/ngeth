import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MetaMask } from '@ngeth/ethers';

@Component({
  selector: 'nxeth-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {

  constructor(private metamask: MetaMask) {}

  create() {
    // 
  }
}
