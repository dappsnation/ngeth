import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChainManager, ETH_PROVIDER, MetaMaskProvider } from '@ngeth/ethers';

@Component({
  selector: 'ngeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    private router: Router,
    private chain: ChainManager,
    @Inject(ETH_PROVIDER) public provider?: MetaMaskProvider,
  ) {
  }
  
  async ngOnInit() {
    const chain = await this.chain.getChain();
    console.log(chain);
  }

  redirect(path: string) {
    this.router.navigate([path]);
  }
}
