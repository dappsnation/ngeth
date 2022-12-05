import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { WalletProfile } from '@ngeth/ethers-core';
import { NgERC1193 } from '../../erc1193';
import { tap } from 'rxjs';

interface DialogElement extends HTMLElement {
  showModal: () => void;  
}

@Component({
  selector: 'eth-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EthConnectComponent {

  @ViewChild('selectDialog') selectDialog!: ElementRef<DialogElement>;

  wallets = this.erc1193.wallets;
  account$ = this.erc1193.account$.pipe(tap(console.log));
  connected$ = this.erc1193.connected$;

  constructor(private erc1193: NgERC1193) { }

  select(wallet: WalletProfile) {
    this.erc1193.selectWallet(wallet);
  }

  async enable() {
    if (this.wallets.length === 1) {
      await this.erc1193.selectWallet(this.wallets[0]);
      return this.erc1193.enable();
    }
    return this.selectDialog.nativeElement.showModal();
  }
}
