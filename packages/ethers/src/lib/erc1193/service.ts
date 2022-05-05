import { inject, NgZone } from '@angular/core';
import { EventFilter, Provider } from '@ethersproject/abstract-provider';
import { getAddress } from '@ethersproject/address';
import { ERC1193Events, ERC1193Param, ERC1193Provider } from './types';
import { toChainIndex } from '../chain/utils';
import { timer, Observable, of, combineLatest, defer, BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap, filter } from 'rxjs/operators';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';


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

export abstract class ERC1193<P extends ERC1193Provider = ERC1193Provider> {
  private _provider?: Web3Provider;
  private _signer?: JsonRpcSigner;
  private _ethereum = new BehaviorSubject<P | null>(null);
  private events: Record<string, Observable<unknown>> = {};
  private zone = inject(NgZone);
  ethereum$ = this._ethereum.asObservable();
  
  // abstract provider: ERC1193Provider;
  abstract account?: string;
  abstract chainId?: number;

  /** Used to select the provider to use */
  abstract enable(): unknown;

  hasProvider$ = this.ethereum$.pipe(
    map(ethereum => !!ethereum)
  );

  /** Observe if current account is connected */
  connected$ = this.ethereum$.pipe(
    filter(exist),
    switchMap(ethereum => {
      return combineLatest([
        this.fromEvent(ethereum, 'connect', undefined),
        this.fromEvent(ethereum, 'disconnect', undefined),
      ])
    }),
    switchMap(() => {
      if (this.ethereum?.isConnected()) return of(true);
      return timer(500).pipe(map(() => this.ethereum?.isConnected()))
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
    
  /**
   * First account connected to the dapp, if any
   * @note This might not be the selected account in Metamask
   */
  account$ = this.ethereum$.pipe(
    filter(exist),
    switchMap(ethereum => this.fromEvent(ethereum, 'accountsChanged', [])),
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

  chainId$ = this.ethereum$.pipe(
    filter(exist),
    switchMap(ethereum => this.fromEvent(ethereum, 'chainChanged', undefined)),
    switchMap(() => {
      if (this.chainId) return of(this.chainId);
      return timer(500).pipe(map(() => this.chainId))
    }),
    filter(exist),
    map(chainId => toChainIndex(chainId)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  message$ = this.ethereum$.pipe(
    filter(exist),
    switchMap(ethereum => this.fromEvent(ethereum, 'message')),
  );

  getSigner(): JsonRpcSigner {
    if (!this._signer) {
      this._signer = this.getProvider().getSigner();
    }
    return this._signer;
  }
  
  getProvider(): Web3Provider {
    if (!this._provider) {
      const ethereum = this.ethereum;
      if (!ethereum) throw new Error('No Ethereum Provider selected yet.')
      this._provider = new Web3Provider(ethereum);
    }
    return this._provider;
  }

  protected get ethereum() {
    return this._ethereum.getValue();
  }

  protected set ethereum(ethereum: P | null) {
    this._ethereum.next(ethereum);
  }

  /** Listen on event from MetaMask Provider */
  protected fromEvent<K extends keyof ERC1193Events>(
    provider: P,
    event: K,
    initial?: ERC1193Param<K>
  ): Observable<ERC1193Param<K>> {
    if (!this.events[event]) {
      this.events[event] = defer(() => {
        return fromEthEvent<ERC1193Param<K>>(provider, this.zone, event, initial);
      });
    }
    return this.events[event] as Observable<ERC1193Param<K>>;
  }
}
