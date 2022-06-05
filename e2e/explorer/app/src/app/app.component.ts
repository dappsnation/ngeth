import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WalletManager } from './wallet';
import { isAddress } from '@ethersproject/address';
import { Router } from '@angular/router';
import { Provider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';

const privateKeys = [
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
];

@Component({
  selector: 'eth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.walletManager.signer?.sendTransaction({ value: parseEther('1'), to: this.walletManager.accounts[1] })
  }

  async search(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    const value = input.value.trim();
    if (isAddress(value)) {
      this.router.navigate(['/address', value]);
    } else if (value.startsWith('0x')) {
      this.router.navigate(['/tx', value]);
    } else if (!isNaN(parseInt(value))) {
      this.router.navigate(['/block', value]);
    }
    input.value = '';
  }

  select(address: string) {
    this.walletManager.select(address);
  }
}
