import { Injectable } from '@angular/core';
import { ERC1193 } from './service';
import { getAddress } from '@ethersproject/address';
import { toChainIndex } from '../chain';
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

@Injectable({ providedIn: 'root' })
export class InjectedProviders extends ERC1193 {
  wallets = getInjectedProviders().map(toInjectedWallet);

  constructor() {
    super();
    if (this.wallets.length === 1) this.selectWallet(this.wallets[0]);
  }

  get account() {
    if (!this.provider?.selectedAddress) return;
    return getAddress(this.provider.selectedAddress);
  }

  get chainId() {
    if (!this.provider?.chainId) return;
    return toChainIndex(this.provider.chainId);
  }
}