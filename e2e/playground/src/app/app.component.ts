import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ETH_PROVIDER, MetaMaskProvider } from '@ngeth/ethers';

@Component({
  selector: 'nxeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    @Inject(ETH_PROVIDER) public provider?: MetaMaskProvider
  ) {}

}
