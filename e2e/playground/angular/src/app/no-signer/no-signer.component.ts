import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgERC1193, HasSignerGuard } from '@ngeth/ethers-angular';
import { WalletProfile } from '@ngeth/ethers-core';

@Component({
  selector: 'ngeth-no-signer',
  templateUrl: './no-signer.component.html',
  styleUrls: ['./no-signer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoSignerComponent {
  wallets = this.erc1193.wallets;

  constructor(
    private guard: HasSignerGuard,
    private router: Router,
    private erc1193: NgERC1193
  ) { }

  async enable(wallet: WalletProfile) {
    await this.erc1193.selectWallet(wallet);
    const isEnabled = await this.erc1193.enable();
    if (isEnabled) {
      this.router.navigateByUrl(this.guard.previous ?? '/');
    }
  }

}
