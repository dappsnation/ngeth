import { Injectable } from '@angular/core';
import { AddChainParameter, MetaMaskProvider, WatchAssetParams } from './types';
import { getChain, toChainId, ERC1193, toChainIndex } from '@ngeth/ethers';
import { fromChain } from './utils';
import { getAddress } from '@ethersproject/address';
import { Web3Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

@Injectable({ providedIn: 'root' })
export class MetaMask extends ERC1193 {
  private ethersProvider?: Web3Provider;
  get provider(): MetaMaskProvider {
    const provider = (window as any).ethereum;
    if (!provider) throw new Error('No Provider injected in the window object');
    if (!provider.isMetaMask) throw new Error('Provider is not Metamask');
    return provider;
  }

  get account() {
    if (!this.provider.selectedAddress) return;
    return getAddress(this.provider.selectedAddress);
  }

  get chainId() {
    return toChainIndex(this.provider.chainId);
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
}
