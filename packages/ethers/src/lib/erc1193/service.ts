import { inject, NgZone } from '@angular/core';
import { getAddress } from '@ethersproject/address';
import { AddChainParameter, ERC1193Events, ERC1193Param, ERC1193Provider, WalletProfile, WatchAssetParams } from './types';
import { toChainIndex } from '../chain/utils';
import { timer, Observable, of, combineLatest, defer, BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap, filter } from 'rxjs/operators';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { fromEthEvent } from '../events';
import { getChain, toChainId } from '../chain';
import { fromChain } from './utils';


const errorCode = {
  4001:	'[User Rejected Request] The user rejected the request.',
  4100:	'[Unauthorized] 	The requested method and/or account has not been authorized by the user.',
  4200:	'[Unsupported Method]	The Provider does not support the requested method.',
  4900:	'[Disconnected] The Provider is disconnected from all chains.',
  4901:	'[Chain Disconnected] The Provider is not connected to the requested chain.',
}



function exist<T>(value?: T | null): value is T {
  return value !== undefined && value !== null;
}


export abstract class ERC1193<Wallet extends WalletProfile = WalletProfile> {
  private zone = inject(NgZone);
  #ethersProvider?: Web3Provider;
  #ethersSigner?: JsonRpcSigner;
  #wallet = new BehaviorSubject<Wallet | null>(null);
  #events: Record<string, Observable<unknown>> = {};

  walletChanges = this.#wallet.asObservable();
  
  protected provider?: ERC1193Provider;
  abstract account?: string;
  abstract chainId?: number;
  abstract wallets: Wallet[];
  /** Method used to ask the user which wallet to select if multiple wallet available */
  protected abstract getWallet(): Promise<Wallet | undefined>;

  /** Observe if current account is connected */
  connected$ = this.walletChanges.pipe(
    filter(exist),
    switchMap(wallet => {
      return combineLatest([
        this.fromEvent(wallet, 'connect', undefined),
        this.fromEvent(wallet, 'disconnect', undefined),
      ])
    }),
    switchMap(() => {
      if (this.provider?.isConnected()) return of(true);
      return timer(500).pipe(map(() => this.provider?.isConnected()))
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
    
  /**
   * First account connected to the dapp, if any
   * @note This might not be the selected account in Metamask
   */
  account$ = this.walletChanges.pipe(
    switchMap(wallet => wallet ? this.fromEvent(wallet, 'accountsChanged', []) : of(void 0)),
    switchMap(() => {
      if (this.account) return of([this.account]);
      return timer(500).pipe(map(() => (this.account ? [this.account] : [])));
    }),
    map(accounts => accounts.length ? getAddress(accounts[0]) : undefined),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  /** 
   * Current account. Doesn't emit until therer is a connected account
   * @note ⚠️ Only use if you're sure there is an account (inside a guard for example)
   */
  currentAccount$ = this.account$.pipe(filter(exist));

  chainId$ = this.walletChanges.pipe(
    switchMap(wallet => wallet ? this.fromEvent(wallet, 'chainChanged', undefined) : of(void 0)),
    switchMap(() => {
      if (this.chainId) return of(this.chainId);
      return timer(500).pipe(map(() => this.chainId))
    }),
    filter(exist),
    map(chainId => toChainIndex(chainId)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  message$ = this.walletChanges.pipe(
    filter(exist),
    switchMap(wallet => this.fromEvent(wallet, 'message')),
  );

  get ethersProvider() {
    return this.#ethersProvider;
  }

  get ethersSigner() {
    return this.#ethersSigner;
  }

  /** Listen on event from MetaMask Provider */
  protected fromEvent<K extends keyof ERC1193Events>(
    wallet: Wallet,
    event: K,
    initial?: ERC1193Param<K>
  ): Observable<ERC1193Param<K>> {
    if (!this.#events[event]) {
      this.#events[event] = defer(() => {
        return fromEthEvent<ERC1193Param<K>>(wallet.provider, this.zone, event, initial);
      });
    }
    return this.#events[event] as Observable<ERC1193Param<K>>;
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
      this.#wallet.next(wallet);
      this.provider = wallet.provider;
    }
  }

  /** Select a wallet and connect to it */
  async enable(wallet?: Wallet): Promise<string[]> {
    await this.selectWallet(wallet);
    if (!this.provider) throw new Error('No provider connected to ERC1193 service');
    return this.provider.request({ method: 'eth_requestAccounts' });
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
}
