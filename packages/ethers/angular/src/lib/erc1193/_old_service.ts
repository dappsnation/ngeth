import { inject, NgZone } from '@angular/core';
import { getAddress } from '@ethersproject/address';
import { NgERC1193Events, NgERC1193Param, WalletProfile } from './types';
import { toChainId, ERC1193 } from '@ngeth/ethers-core';
import { timer, Observable, of, combineLatest, defer, BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap, filter } from 'rxjs/operators';
import { fromEthEvent } from '../events';


function exist<T>(value?: T | null): value is T {
  return value !== undefined && value !== null;
}


export abstract class NgERC1193<Wallet extends WalletProfile = WalletProfile> extends ERC1193<Wallet> {
  private zone = inject(NgZone);
  #wallet = new BehaviorSubject<Wallet | null>(null);
  #events: Record<string, Observable<unknown>> = {};
  walletChanges = this.#wallet.asObservable();

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
