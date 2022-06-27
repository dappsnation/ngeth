import { Inject, inject, Injectable, InjectFlags, InjectionToken, Injector, Optional } from '@angular/core';
import { MetaMaskProvider, RequestedPermissions, Web3WalletPermission } from './types';
import { ngErc1193, NgERC1193 } from '@ngeth/ethers-angular';
import { ERC1193, toChainId, WalletProfile } from '@ngeth/ethers-core';
import { getAddress } from '@ethersproject/address';

// Reload message when "Could not establish connection." happens
export const METAMASK_RELOAD = new InjectionToken<() => void>('Callback to ask user to reload the page because of Metamask network issue.');
function getNotInitializedError() {
  const error = 'Metamask is not initialized. You need to reload the page.';
  const why = 'This usually happens when Metamask was not initialized when you loaded the page.';
  const solution = 'Use "METAMASK_RELOAD" injector to display a network message to your user.';
  const example = 'Ex: { provide: METAMASK_RELOAD, useValue: () => window.alert("Could not connect to Metamask. Please reload the page.") }.';
  return [error, why, solution, example].join('\n');
}


function getMetamask(): MetaMaskProvider | undefined {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return;
  if (Array.isArray(ethereum.providers)) return ethereum.providers.find((p: any) => p.isMetaMask);
  if (!ethereum.isMetaMask) return;
  return ethereum;
}

function metamaskWallet() {
  const provider = getMetamask();
  if (!provider) return;
  return { label: 'MetaMask', provider };
}


export class MetaMask extends ERC1193 {
  wallet?: WalletProfile;
  wallets: WalletProfile[] = [];

  constructor(private reloadWarning?: (() => void) | null) {
    super();
  }

  protected override onInit() {
    const metamask = metamaskWallet();
    if (metamask) {
      this.wallets.push(metamask);
      super.selectWallet(); // Use super to avoid notInitializedError warning at loadtime
    }
  }

  protected onWalletChange(wallet: WalletProfile): void {
    this.wallet = wallet;
  }

  protected async getWallet(): Promise<WalletProfile | undefined> {
    return this.wallets[0];
  }
  
  get account() {
    if (!this.provider?.selectedAddress) return;
    return getAddress(this.provider.selectedAddress);
  }

  get chainId() {
    if (!this.provider?.chainId) return;
    return toChainId(this.provider.chainId);
  }

  // Handle "Could not establish connection."
  // https://github.com/MetaMask/metamask-extension/issues/13465
  private notInitializedError() {
    if (this.reloadWarning) {
      this.reloadWarning();
    } else {
      console.error(getNotInitializedError());
    }
  }

  override selectWallet() {
    if (!this.wallets.length) throw new Error('No metamask injected');
    if (!(this.wallets[0].provider as any)._state.initialized) this.notInitializedError();
    return super.selectWallet();
  }

  /** Gets the caller's current permissions */
  getPermissions() {
    return this.provider?.request<Web3WalletPermission[]>({
      method: 'wallet_getPermissions'
    });
  }

  /** Requests the given permissions from the user.  */
  requestPermissions(permissions: RequestedPermissions) {
    return this.provider?.request<Web3WalletPermission[]>({
      method: 'wallet_requestPermissions',
      params: [permissions],
    });
  }
}
