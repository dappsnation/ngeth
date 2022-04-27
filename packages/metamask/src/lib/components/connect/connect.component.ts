import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ChainManager } from '@ngeth/ethers';
import { MetaMask } from '../../service';

@Component({
  selector: 'metamask-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectComponent {

  @Output() connect = new EventEmitter();

  account$ = this.metamask.account$;
  chain$ = this.chain.chain$;

  constructor(
    private chain: ChainManager,
    private metamask: MetaMask,
  ) {}

  async enable() {
    const accounts = await this.metamask.enable();
    if (accounts.length) this.connect.emit(accounts[0]);
  }
}
