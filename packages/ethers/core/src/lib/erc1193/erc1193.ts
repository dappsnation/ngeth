import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { AddChainParameter, ERC1193Provider, WalletProfile, WatchAssetParams } from './types';
import { toChainHex } from '../chain/utils';


const errorCode = {
  4001:	'[User Rejected Request] The user rejected the request.',
  4100:	'[Unauthorized] 	The requested method and/or account has not been authorized by the user.',
  4200:	'[Unsupported Method]	The Provider does not support the requested method.',
  4900:	'[Disconnected] The Provider is disconnected from all chains.',
  4901:	'[Chain Disconnected] The Provider is not connected to the requested chain.',
}

export abstract class ERC1193<Wallet extends WalletProfile = WalletProfile> {
  #ethersProvider?: Web3Provider;
  #ethersSigner?: JsonRpcSigner;
  
  protected provider?: ERC1193Provider;
  abstract account?: string;
  abstract chainId?: number;
  abstract wallets: Wallet[];
  /** Method used to ask the user which wallet to select if multiple wallet available */
  protected abstract getWallet(): Promise<Wallet | undefined>;
  protected abstract onWalletChange(wallet: Wallet): void;

  get ethersProvider() {
    return this.#ethersProvider;
  }

  get ethersSigner() {
    return this.#ethersSigner;
  }

  /** Select a wallet to setup the provider & signer */
  async selectWallet(wallet?: Wallet) {
    if (!wallet) {
      if (!this.wallets.length) throw new Error('No wallet provided or found');
      wallet = await this.getWallet();
      if (!wallet) throw new Error('No wallet selected');
    }
    if (wallet.provider !== this.provider) {
      this.#ethersProvider = new Web3Provider(wallet.provider);
      this.#ethersSigner = this.#ethersProvider.getSigner();
      this.onWalletChange(wallet);
      this.provider = wallet.provider;
    }
  }

  /** Select a wallet and connect to it */
  async enable(wallet?: Wallet): Promise<string[]> {
    await this.selectWallet(wallet);
    if (!this.provider) throw new Error('No provider connected to ERC1193');
    return this.provider.request({ method: 'eth_requestAccounts' });
  }

  /**
   * Request user to change chain
   * @note If the error code (error.code) is 4902, then the requested chain has not been added by MetaMask, and you have to request to add it via addChain
   * @param id The 0x-non zero chainId or decimal number
   */
  switchChain(id: string | number) {
    const chainId = toChainHex(id);
    if (!this.provider) throw new Error('No provider connected to ERC1193');
    return this.provider.request<null>({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    });
  }

  addChain(chain: AddChainParameter) {
    if (!this.provider) throw new Error('No provider connected to ERC1193');
    return this.provider.request<null>({
      method: 'wallet_addEthereumChain',
      params: [chain]
    });
  }

  watchAsset(params: WatchAssetParams['options']) {
    if (!this.provider) throw new Error('No provider connected to ERC1193');
    return this.provider.request<boolean>({
      method: 'wallet_watchAsset',
      params: { type: 'ERC20', options: params }
    });
  }
}
