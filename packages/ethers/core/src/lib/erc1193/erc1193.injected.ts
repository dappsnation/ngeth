import { getAddress } from '@ethersproject/address';
import { ERC1193 } from './erc1193';
import { toChainId } from '../chain/utils';
import { ERC1193Provider, WalletProfile } from './types';

function toInjectedWallet(provider: any): WalletProfile {
  if (provider.isMetaMask) return { label: 'MetaMask', provider };
  if (provider.isCoinbaseWallet) return { label: 'Coinbase', provider };
  return { label: 'Unknown', provider };
}

function getInjectedProviders(): ERC1193Provider[] {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return [];
  if (Array.isArray(ethereum.providers) && ethereum.providers.length) {
    return Array.from(new Set(ethereum.providers));
  }
  return [ethereum];
}

export class InjectedProviders extends ERC1193 {
  wallet?: WalletProfile;
  wallets = getInjectedProviders().map(toInjectedWallet);

  protected override onInit() {
    if (this.wallets.length === 1) this.selectWallet(this.wallets[0]);
    const label = localStorage.getItem('ngeth:erc1193');
    if (label) {
      const wallet = this.wallets.find(wallet => wallet.label === label);
      if (wallet) this.selectWallet(wallet);
    }
  }

  protected onWalletChange(wallet: WalletProfile) {
    this.wallet = wallet;
    localStorage.setItem('ngeth:erc1193', wallet.label);
  }

  // protected async getWallet() {
  //   if (!this.wallets.length) return;
  //   if (this.wallets.length === 1) return this.wallets[0];
  //   const labels = this.wallets.map(w => w.label);
  //   const res = prompt(`Which wallet do you want to use ? ${labels.join(', ')}`);
  //   const wallet = this.wallets.find(w => w.label.toLowerCase() === res?.toLowerCase());
  //   if (!wallet) alert(`"${res}" is not part of options: ${labels.join(', ')}`);
  //   return wallet;
  // }

  get account() {
    if (!this.provider?.selectedAddress) return;
    return getAddress(this.provider.selectedAddress);
  }

  get chainId() {
    if (!this.provider?.chainId) return;
    return toChainId(this.provider.chainId);
  }
}