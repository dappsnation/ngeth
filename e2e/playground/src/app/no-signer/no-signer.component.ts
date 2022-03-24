import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { HasSignerGuard, MetaMask } from '@ngeth/ethers';

@Component({
  selector: 'nxeth-no-signer',
  templateUrl: './no-signer.component.html',
  styleUrls: ['./no-signer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoSignerComponent {

  constructor(
    private guard: HasSignerGuard,
    private router: Router,
    private metamask: MetaMask
  ) { }

  async enable() {
    const isEnabled = await this.metamask.enable();
    if (isEnabled) {
      this.router.navigateByUrl(this.guard.previous ?? '/');
    }
  }

}
