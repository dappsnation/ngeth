import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HasMetamaskGuard, MetaMaskOnboarding } from '@ngeth/metamask';

@Component({
  selector: 'ngeth-no-provider',
  templateUrl: './no-provider.component.html',
  styleUrls: ['./no-provider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoProviderComponent {
  previous = this.guard.previous ?? this.onboarding.redirect;
  hasMetamask = this.onboarding.hasMetamask();
  constructor(
    private guard: HasMetamaskGuard,
    private onboarding: MetaMaskOnboarding,
  ) {}

  async onboard() {
    this.onboarding.install();
  }
}
