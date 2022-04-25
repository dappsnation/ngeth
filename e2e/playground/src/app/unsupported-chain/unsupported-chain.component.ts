import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChainManager, IsSupportedChainGuard, MetaMask, SUPPORTED_CHAINS } from '@ngeth/ethers';

function retry(amount: number, delay: number, condition: () => boolean) {
  return new Promise<void>((res) => {
    const tryAgain = (): unknown => setTimeout(() => {
      if (amount === 0) res();
      amount--;
      return condition() ? res() : tryAgain();
    }, delay);
    tryAgain();
  })
}

@Component({
  selector: 'ngeth-unsupported-chain',
  templateUrl: './unsupported-chain.component.html',
  styleUrls: ['./unsupported-chain.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsupportedChainComponent {
  private previous = this.guard.previous;
  current$ = this.chains.chain$;
  expected$ = Promise.all(this.supportedChains.map(chain => this.chains.getChain(chain)));
  constructor(
    @Inject(SUPPORTED_CHAINS) private supportedChains: number[],
    private chains: ChainManager,
    private metamask: MetaMask,
    private router: Router,
    private guard: IsSupportedChainGuard
  ) { }

  async switch(chainId: string | number) {
    const current = this.metamask.chainId;
    await this.metamask.switchChain(chainId);
    // Give time to metamask to update
    await retry(5, 200, () => current !== this.metamask.chainId);
    const url = this.previous || '/';
    this.router.navigateByUrl(url);
  }
}
