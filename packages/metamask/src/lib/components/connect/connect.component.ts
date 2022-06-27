import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ChainManager, NgERC1193 } from '@ngeth/ethers-angular';

@Component({
  selector: 'metamask-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectComponent {

  @Output() connect = new EventEmitter();

  account$ = this.erc1193.account$;
  chain$ = this.chain.chain$;

  constructor(
    private chain: ChainManager,
    private erc1193: NgERC1193,
  ) {}

  async enable() {
    const accounts = await this.erc1193.enable();
    if (accounts.length) this.connect.emit(accounts[0]);
  }
}
