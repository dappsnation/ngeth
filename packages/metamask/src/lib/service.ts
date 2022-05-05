import { inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { AddChainParameter, MetaMaskProvider, RequestedPermissions, WatchAssetParams, Web3WalletPermission } from './types';
import { getChain, toChainId, ERC1193, toChainIndex } from '@ngeth/ethers';
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


function getMetamask() {
  const ethereum = (window as any).ethereum;
  if (!ethereum) throw new Error('No Provider injected in the window object');
  if (Array.isArray(ethereum.providers)) {
    const provider = ethereum.providers.find((p: any) => p.isMetaMask);
    if (!provider)  throw new Error('No Metamask provider found');
    return provider;
  }
  if (!ethereum.isMetaMask) throw new Error('Provider is not Metamask');
  return ethereum;
}

@Injectable({ providedIn: 'root' })
export class MetaMask extends ERC1193<MetaMaskProvider> {
  private injector = inject(Injector);

  constructor() {
    super();
    if (this.hasMetamask()) this.ethereum = getMetamask();
  }

  hasMetamask() {
    try {
      return !!getMetamask();
    } catch(err) {
      console.error(err);
      return false;
    }
  }

  get account() {
    if (!this.ethereum?.selectedAddress) return;
    return getAddress(this.ethereum.selectedAddress);
  }

  get chainId() {
    if (!this.ethereum?.chainId) return;
    return toChainIndex(this.ethereum?.chainId);
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

  async enable(): Promise<string[]> {
    if (!this.ethereum) this.ethereum = getMetamask();
    if (!(this.ethereum as any)._state.initialized) this.notInitializedError();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.ethereum!.request({ method: 'eth_requestAccounts' });
  }

  /**
   * Request user to change chain
   * @note If the error code (error.code) is 4902, then the requested chain has not been added by MetaMask, and you have to request to add it via addChain
   * @param id The 0x-non zero chainId or decimal number
   */
  switchChain(id: string | number) {
    const chainId = toChainId(id);
    return this.ethereum?.request<null>({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    });
  }

  async addChain(chain: AddChainParameter | string) {
    const params = (typeof chain === "string")
      ? await getChain(chain).then(fromChain)
      : chain;
    return this.ethereum?.request<null>({
      method: 'wallet_addEthereumChain',
      params: [params]
    });
  }

  watchAsset(params: WatchAssetParams['options']) {
    return this.ethereum?.request<boolean>({
      method: 'wallet_watchAsset',
      params: { type: 'ERC20', options: params }
    });
  }

  /** Gets the caller's current permissions */
  getPermissions() {
    return this.ethereum?.request<Web3WalletPermission[]>({
      method: 'wallet_getPermissions'
    });
  }

  /** Requests the given permissions from the user.  */
  requestPermissions(permissions: RequestedPermissions) {
    return this.ethereum?.request<Web3WalletPermission[]>({
      method: 'wallet_requestPermissions',
      params: [permissions],
    });
  }
}
