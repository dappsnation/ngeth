import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HasWalletGuard } from '@ngeth/ethers';
import { MetaMaskOnboarding } from '@ngeth/metamask';

@Component({
  selector: 'ngeth-no-wallet',
  templateUrl: './no-wallet.component.html',
  styleUrls: ['./no-wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoWalletComponent {
  previous = this.guard.previous ?? this.onboarding.redirect;
  hasMetamask = this.onboarding.hasMetamask();
  constructor(
    private guard: HasWalletGuard,
    private onboarding: MetaMaskOnboarding,
  ) {}

  async onboard() {
    this.onboarding.install();
  }
}
