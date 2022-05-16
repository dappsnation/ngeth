import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ERC1193, HasSignerGuard } from '@ngeth/ethers';

@Component({
  selector: 'ngeth-no-signer',
  templateUrl: './no-signer.component.html',
  styleUrls: ['./no-signer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoSignerComponent {

  constructor(
    private guard: HasSignerGuard,
    private router: Router,
    private metamask: ERC1193
  ) { }

  async enable() {
    const isEnabled = await this.metamask.enable();
    if (isEnabled) {
      this.router.navigateByUrl(this.guard.previous ?? '/');
    }
  }

}
