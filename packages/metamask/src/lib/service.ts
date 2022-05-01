import { inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { AddChainParameter, MetaMaskProvider, RequestedPermissions, WatchAssetParams, Web3WalletPermission } from './types';
import { getChain, toChainId, ERC1193, toChainIndex } from '@ngeth/ethers';
import { fromChain } from './utils';
import { getAddress } from '@ethersproject/address';
import { Web3Provider } from '@ethersproject/providers';

// Reload message when "Could not establish connection." happens
const METAMASK_RELOAD = new InjectionToken<() => void>('Callback to ask user to reload the page because of Metamask network issue.');
function getNotInitializedError() {
  const error = 'Metamask is not initialized. You need to reload the page.';
  const why = 'This usually happens when Metamask was not initialized when you loaded the page.';
  const solution = 'Use "METAMASK_RELOAD" injector to display a network message to your user.';
  const example = 'Ex: { provide: METAMASK_RELOAD, useValue: () => window.alert("Could not connect to Metamask. Please reload the page.") }.';
  return [error, why, solution, example].join('\n');
}


@Injectable({ providedIn: 'root' })
export class MetaMask extends ERC1193 {
  private _provider?: MetaMaskProvider;
  private injector = inject(Injector);
  private ethersProvider?: Web3Provider;

  get provider(): MetaMaskProvider {
    if (this._provider) return this._provider;
    const provider = (window as any).ethereum;
    if (!provider) throw new Error('No Provider injected in the window object');
    if (!provider.isMetaMask) throw new Error('Provider is not Metamask');
    if (!provider._state.initialized) this.notInitializedError();
    this._provider = provider;
    return this._provider as MetaMaskProvider;
  }

  get account() {
    if (!this.provider.selectedAddress) return;
    return getAddress(this.provider.selectedAddress);
  }

  get chainId() {
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

  getSigner() {
    if (!this.ethersProvider) {
      this.ethersProvider = new Web3Provider(this.provider);
    }
    return this.ethersProvider.getSigner();
  }

  enable(): Promise<string[]> {
    return this.provider.request({ method: 'eth_requestAccounts' });
  }

  /**
   * Request user to change chain
   * @note If the error code (error.code) is 4902, then the requested chain has not been added by MetaMask, and you have to request to add it via addChain
   * @param id The 0x-non zero chainId or decimal number
   */
  switchChain(id: string | number) {
    const chainId = toChainId(id);
    return this.provider.request<null>({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    });
  }

  async addChain(chain: AddChainParameter | string) {
    const params = (typeof chain === "string")
      ? await getChain(chain).then(fromChain)
      : chain;
    return this.provider.request<null>({
      method: 'wallet_addEthereumChain',
      params: [params]
    });
  }

  watchAsset(params: WatchAssetParams['options']) {
    return this.provider.request<boolean>({
      method: 'wallet_watchAsset',
      params: { type: 'ERC20', options: params }
    });
  }

  /** Gets the caller's current permissions */
  getPermissions() {
    return this.provider.request<Web3WalletPermission[]>({
      method: 'wallet_getPermissions'
    });
  }

  /** Requests the given permissions from the user.  */
  requestPermissions(permissions: RequestedPermissions) {
    return this.provider.request<Web3WalletPermission[]>({
      method: 'wallet_requestPermissions',
      params: [permissions],
    });
  }
}
