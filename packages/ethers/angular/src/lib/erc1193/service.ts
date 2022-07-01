import { inject, NgZone } from '@angular/core';
import { getAddress } from '@ethersproject/address';
import { NgERC1193Events, NgERC1193Param, WalletProfile } from './types';
import { toChainId, ERC1193, ProviderMessage } from '@ngeth/ethers-core';
import { timer, Observable, of, combineLatest, defer, BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap, filter } from 'rxjs/operators';
import { fromEthEvent } from '../events';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';


function exist<T>(value?: T | null): value is T {
  return value !== undefined && value !== null;
}


type Constructor<T> = new (...args: any[]) => T;

type ERC1193Constructor<
  W extends WalletProfile = WalletProfile,
  T extends ERC1193<W> = ERC1193<W>,
> = Constructor<T>;

type NgERC1193Constructor<
  W extends WalletProfile = WalletProfile,
  T extends ERC1193Constructor<W> = ERC1193Constructor<W>,
> = T & Constructor<INgERC1193>;

export interface INgERC1193 {
  connected$: Observable<boolean | undefined>;
  account$: Observable<string | undefined>;
  currentAccount$: Observable<string>;
  chainId$: Observable<number>;
  message$: Observable<ProviderMessage>;
}

export function ngErc1193<
  Wallet extends WalletProfile,
  T extends ERC1193Constructor<Wallet>
>(type: T, ...args: unknown[]): NgERC1193Constructor<Wallet, T> {
  
  abstract class NgERC1193 extends type {
    private zone = inject(NgZone);
    #wallet = new BehaviorSubject<Wallet | null>(null);
    #events: Record<string, Observable<unknown>> = {};
    walletChanges = this.#wallet.asObservable();

    constructor(...arg: any[]) {
      super(...args);
      if (this.onInit) this.onInit();
    }
  
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
      map(chainId => toChainId(chainId)),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  
    message$ = this.walletChanges.pipe(
      filter(exist),
      switchMap(wallet => this.fromEvent(wallet, 'message')),
    );
  
  
    onWalletChange(wallet: Wallet) {
      super['onWalletChange'](wallet);
      this.#wallet.next(wallet);
    }
  
    /** Listen on event from MetaMask Provider */
    protected fromEvent<K extends keyof NgERC1193Events>(
      wallet: Wallet,
      event: K,
      initial?: NgERC1193Param<K>
    ): Observable<NgERC1193Param<K>> {
      if (!this.#events[event]) {
        this.#events[event] = defer(() => {
          return fromEthEvent<NgERC1193Param<K>>(wallet.provider, this.zone, event, initial);
        });
      }
      return this.#events[event] as Observable<NgERC1193Param<K>>;
    }
  }
  return NgERC1193 as any;
}

export abstract class NgERC1193<W extends WalletProfile = WalletProfile> extends ERC1193<W> implements INgERC1193 {
  abstract walletChanges: Observable<W | null>;
  abstract connected$: Observable<boolean | undefined>;
  abstract account$: Observable<string | undefined>;
  abstract currentAccount$: Observable<string>;
  abstract chainId$: Observable<number>;
  abstract message$: Observable<ProviderMessage>;
}

function isNgErc1193(erc1193: ERC1193Constructor) {
  const names = Object.getOwnPropertyNames(erc1193.prototype);
  return names.includes('fromEvent');
}

export function ngEthersProviders<T extends ERC1193Constructor>(erc1193: T) {
  return [{
    provide: NgERC1193,
    useClass: isNgErc1193(erc1193) ? erc1193 : ngErc1193(erc1193)
  },{
    provide: Provider,
    useFactory: (erc1193: NgERC1193) => erc1193.ethersProvider,
    deps: [NgERC1193]
  }, {
    provide: Signer,
    useFactory: (erc1193: NgERC1193) => erc1193.ethersSigner,
    deps: [NgERC1193]
  }];
}
