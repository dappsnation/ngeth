import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ETH_PROVIDER, MetaMaskProvider } from '@ngeth/ethers';

@Component({
  selector: 'nxeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    private router: Router,
    @Inject(ETH_PROVIDER) public provider?: MetaMaskProvider,
  ) {}

  redirect(path: string) {
    this.router.navigate([path]);
  }
}
