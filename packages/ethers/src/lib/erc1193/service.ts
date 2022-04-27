import { inject, NgZone } from '@angular/core';
import { Provider, } from '@ethersproject/providers';
import { EventFilter } from '@ethersproject/abstract-provider';
import { timer, Observable, of, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, filter, startWith } from 'rxjs/operators';
import { getAddress } from '@ethersproject/address';
import { ERC1193Events, ERC1193Provider } from './types';
import { toChainIndex } from '../chain/utils';


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


export function fromEthEvent<T>(
  provider: Provider | ERC1193Provider,
  zone: NgZone,
  event: string | EventFilter,
  initial?: any
) {
  return new Observable<T>((subscriber) => {
    if (arguments.length === 4) zone.run(() => subscriber.next(initial as any));
    const handler = (...args: any[]) => {
      zone.run(() => subscriber.next(1 < args.length ? args : args[0]));
    };
    provider.addListener(event as any, handler);
    return () => provider.removeListener(event as any, handler);
  });
}

export abstract class ERC1193 {
  abstract provider: any;
  abstract account?: string;
  abstract chainId: number;
  private zone = inject(NgZone);

  private events: Record<string, Observable<unknown>> = {};

  /** Observe if current account is connected */
  connected$ = combineLatest([
    this.fromEvent('connect'),
    this.fromEvent('disconnect'),
  ]).pipe(
    startWith([]),
    switchMap(() => {
      if (this.provider.isConnected()) return of(true);
      return timer(500).pipe(map(() => this.provider.isConnected()))
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
    
  /**
   * First account connected to the dapp, if any
   * @note This might not be the selected account in Metamask
   */
  account$ = this.fromEvent('accountsChanged').pipe(
    startWith([]),
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

  chainId$ = this.fromEvent('chainChanged').pipe(
    startWith(null),
    switchMap(() => {
      if (this.chainId) return of(this.chainId);
      return timer(500).pipe(map(() => this.chainId))
    }),
    filter(exist),
    map(chainId => toChainIndex(chainId)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  message$ = this.fromEvent('message');



  /** Listen on event from MetaMask Provider */
  protected fromEvent<T>(event: keyof ERC1193Events, initial?: T): Observable<T> {
    if (!this.events[event]) {
      this.events[event] = fromEthEvent<T>(this.provider, this.zone, event);
    }
    const listener = this.events[event] as Observable<T>;
    return (initial !== undefined)
      ? listener.pipe(startWith(initial))
      : listener;
  }
}
