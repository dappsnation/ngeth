import { inject, InjectionToken, NgZone } from '@angular/core';
import { Provider, } from '@ethersproject/providers';
import { EventFilter } from '@ethersproject/abstract-provider';
import { timer, Observable, of, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, filter, startWith } from 'rxjs/operators';
import { getAddress } from '@ethersproject/address';
import { AddChainParameter, MetaMaskEvents, MetaMaskProvider, WatchAssetParams } from './types';
import { getChain, toChainId, toChainIndex } from '../chain/utils';
import { fromChain } from './utils';

interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

interface ProviderMessage {
  readonly type: string;
  readonly data: unknown;
}

interface EthSubscription extends ProviderMessage {
  readonly type: 'eth_subscription';
  readonly data: {
    readonly subscription: string;
    readonly result: unknown;
  };
}

interface ProviderConnectInfo {
  readonly chainId: string;
}

const errorCode = {
  4001:	'[User Rejected Request] The user rejected the request.',
  4100:	'[Unauthorized] 	The requested method and/or account has not been authorized by the user.',
  4200:	'[Unsupported Method]	The Provider does not support the requested method.',
  4900:	'[Disconnected] The Provider is disconnected from all chains.',
  4901:	'[Chain Disconnected] The Provider is not connected to the requested chain.',
}

export interface ERC1193Events {
  accountsChanged: (accounts: string[]) => void;
  chainChanged: (chainId: string) => void;
  connect: (connectInfo: ConnectInfo) => void;
  disconnect: (error: ProviderRpcError) => void;
  message: (message: ProviderMessage) => void;
}

function exist<T>(value?: T | null): value is T {
  return value !== undefined && value !== null;
}

export const GET_ETH_PROVIDER = new InjectionToken<() => MetaMaskProvider>('Ethereum ', {
  providedIn: 'root',
  factory: () => () => {
    const provider = (window as any).ethereum;
    if (!provider) {
      throw new Error('No provider found in the window object. Is MetaMask enabled ?');
    }
    return provider;
  }
});


export function fromEthEvent<T>(
  provider: Provider | MetaMaskProvider,
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
  abstract isConnected: () => boolean;
  abstract request(args: RequestArguments): Promise<unknown>;

  private zone = inject(NgZone);
  private getProvider = inject(GET_ETH_PROVIDER);

  private events: Record<string, Observable<unknown>> = {};

  /** Observe if current account is connected */
  connected$ = combineLatest([
    this.fromEvent('connect'),
    this.fromEvent('disconnect'),
  ]).pipe(
    startWith([]),
    switchMap(() => {
      if (this.isConnected()) return of(true);
      return timer(500).pipe(map(() => this.isConnected()))
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
    filter(chainId => !!chainId),
    map(chainId => toChainIndex(chainId)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  message$ = this.fromEvent('message');


  get provider() {
    return this.getProvider();
  }

  get account() {
    if (!this.provider.selectedAddress) return;
    return getAddress(this.provider.selectedAddress);
  }

  get chainId() {
    return toChainIndex(this.provider.chainId);
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

  /** Listen on event from MetaMask Provider */
  protected fromEvent<T>(event: keyof MetaMaskEvents, initial?: T): Observable<T> {
    if (!this.events[event]) {
      this.events[event] = fromEthEvent<T>(this.provider, this.zone, event);
    }
    const listener = this.events[event] as Observable<T>;
    return (initial !== undefined)
      ? listener.pipe(startWith(initial))
      : listener;
  }
}
