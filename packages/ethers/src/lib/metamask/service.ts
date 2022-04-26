import { Inject, Injectable, InjectionToken, NgZone } from '@angular/core';
import { Web3Provider, Provider, } from '@ethersproject/providers';
import { EventFilter } from '@ethersproject/abstract-provider';
import { timer, Observable, of, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, filter, startWith } from 'rxjs/operators';
import { getAddress } from '@ethersproject/address';
import { AddChainParameter, MetaMaskEvents, MetaMaskProvider, WatchAssetParams } from './types';
import { getChain, toChainId, toChainIndex } from '../chain/utils';
import { fromChain } from './utils';

function exist<T>(value?: T | null): value is T {
  return value !== undefined && value !== null;
}

export const ETH_PROVIDER = new InjectionToken<MetaMaskProvider | undefined>('Ethereum ', {
  providedIn: 'root',
  factory: () => (window as any).ethereum
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

@Injectable({ providedIn: 'root' })
export class MetaMask extends Web3Provider {
  private events: Record<string, Observable<unknown>> = {};
  override provider!: MetaMaskProvider;

  /** Observe if current account is connected */
  connected$ = combineLatest([
    this.fromMetaMaskEvent('connect'),
    this.fromMetaMaskEvent('disconnect'),
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
  account$ = this.fromMetaMaskEvent('accountsChanged').pipe(
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

  chainId$ = this.fromMetaMaskEvent('chainChanged').pipe(
    startWith(null),
    switchMap(() => {
      if (this.chainId) return of(this.chainId);
      return timer(500).pipe(map(() => this.chainId))
    }),
    filter(chainId => !!chainId),
    map(chainId => toChainIndex(chainId)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  message$ = this.fromMetaMaskEvent('message');

  constructor(
    private ngZone: NgZone,
    @Inject(ETH_PROVIDER) provider?: MetaMaskProvider,
  ) {
    // TODO: fix with typescript 4.7
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    super(provider!);
    if (!provider) {
      throw new Error('No provider found in the window object. Is MetaMask enabled ?');
    }
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
  protected fromMetaMaskEvent<T>(event: keyof MetaMaskEvents, initial?: T): Observable<T> {
    if (!this.events[event]) {
      this.events[event] = fromEthEvent<T>(this.provider, this.ngZone, event);
    }
    const listener = this.events[event] as Observable<T>;
    return (initial !== undefined)
      ? listener.pipe(startWith(initial))
      : listener;
  }
}
