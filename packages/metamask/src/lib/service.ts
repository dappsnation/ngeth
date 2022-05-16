import { inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { AddChainParameter, MetaMaskProvider, RequestedPermissions, WatchAssetParams, Web3WalletPermission } from './types';
import { getChain, toChainId, ERC1193, toChainIndex, WalletProfile } from '@ngeth/ethers';
import { fromChain } from './utils';
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


@Injectable({ providedIn: 'root' })
export class MetaMask extends ERC1193 {
  wallets: WalletProfile[] = [];
  private injector = inject(Injector);

  constructor() {
    super();
    const metamask = metamaskWallet();
    if (metamask) this.wallets.push(metamask);
  }

  get account() {
    if (!this.provider?.selectedAddress) return;
    return getAddress(this.provider.selectedAddress);
  }

  get chainId() {
    if (!this.provider?.chainId) return;
    return toChainIndex(this.provider.chainId);
  }

  // Handle "Could not establish connection."
  // https://github.com/MetaMask/metamask-extension/issues/13465
  private notInitializedError() {
    const reload = this.injector.get(METAMASK_RELOAD, null);
    if (reload) {
      reload();
    } else {
      console.error(getNotInitializedError());
    }
  }

  override selectWallet() {
    if (!this.wallets.length) throw new Error('No metamask injected');
    if (!(this.wallets[0] as any)._state.initialized) this.notInitializedError();
    return super.selectWallet();
  }

  /**
   * Request user to change chain
   * @note If the error code (error.code) is 4902, then the requested chain has not been added by MetaMask, and you have to request to add it via addChain
   * @param id The 0x-non zero chainId or decimal number
   */
  switchChain(id: string | number) {
    const chainId = toChainId(id);
    return this.provider?.request<null>({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    });
  }

  async addChain(chain: AddChainParameter | string) {
    const params = (typeof chain === "string")
      ? await getChain(chain).then(fromChain)
      : chain;
    return this.provider?.request<null>({
      method: 'wallet_addEthereumChain',
      params: [params]
    });
  }

  watchAsset(params: WatchAssetParams['options']) {
    return this.provider?.request<boolean>({
      method: 'wallet_watchAsset',
      params: { type: 'ERC20', options: params }
    });
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
