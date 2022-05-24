import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WalletManager } from './wallet';
import { isAddress } from '@ethersproject/address';
import { Router } from '@angular/router';
import { Provider } from '@ethersproject/providers';

const privateKeys = [
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
];

@Component({
  selector: 'eth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  accounts$ = this.walletManager.accounts$;
  account$ = this.walletManager.account$;
  constructor(
    private provider: Provider,
    private walletManager: WalletManager,
    private router: Router
  ) {
    this.walletManager.add(privateKeys);
    this.select(this.walletManager.accounts[0]);
  }

  async search(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    if (isAddress(input.value)) {
      const code = await this.provider.getCode(input.value);
      const isContract = (code.length > 2);
      const base = isContract ? '/contract' : '/address';
      this.router.navigate([base, input.value]);
    } else if (input.value.startsWith('0x')) {
      this.router.navigate(['/tx', input.value]);
    } else if (!isNaN(parseInt(input.value))) {
      this.router.navigate(['/block', input.value])
    }
  }

  select(address: string) {
    this.walletManager.select(address);
  }
}
