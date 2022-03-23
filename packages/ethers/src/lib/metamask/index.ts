import {
  Inject,
  Injectable,
  InjectionToken,
  NgZone,
  Optional,
} from '@angular/core';
import {
  Web3Provider,
  Networkish,
  Provider,
} from '@ethersproject/providers';
import { EventFilter } from '@ethersproject/abstract-provider';
import { timer, defer, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, filter } from 'rxjs/operators';
import { getAddress } from '@ethersproject/address';
import { AddChainParameter, MetaMaskEvents, MetaMaskProvider, WatchAssetParams } from './types';
import { getChain } from '../chain/utils';
import { fromChain } from './utils';


const ETH_PROVIDER = new InjectionToken<MetaMaskProvider>('Ethereum ', {
  providedIn: 'root',
  factory: () => {
    if ('ethereum' in window) return (window as any).ethereum;
    throw new Error(
      'No provider found in the window object. Is MetaMask enabled ?'
    );
  },
});

const ETH_NETWORK = new InjectionToken<Networkish>('Ethereum Network');

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
  override provider!: MetaMaskProvider;

  connected$ = defer(() => {
    const initial = this.provider.isConnected();
    return this.fromMetaMaskEvent('connect', initial).pipe(
      map((connected) => !!connected),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  });

  account$ = defer(() => {
    if (this.account) return of([this.account]);
    // Sometime Metamask takes time to find selected Address. Delay in this case
    return timer(500).pipe(map(() => (this.account ? [this.account] : [])));
  }).pipe(
    switchMap((initial) => this.fromMetaMaskEvent('accountsChanged', initial)),
    filter(accounts => !!accounts.length),
    map(accounts => getAddress(accounts[0])),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  chain$ = defer(() => {
    if (this.chainId) return of(this.chainId);
    return timer(500).pipe(map(() => this.chainId))
  }).pipe(
    filter(chainId => !!chainId),
    switchMap(initial => this.fromMetaMaskEvent('chainChanged', initial)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor(
    private ngZone: NgZone,
    @Inject(ETH_PROVIDER) provider: MetaMaskProvider,
    @Optional() @Inject(ETH_NETWORK) network?: Networkish
  ) {
    super(provider, network);
  }

  get account() {
    if (!this.provider.selectedAddress) return;
    return getAddress(this.provider.selectedAddress);
  }

  get chainId() {
    return this.provider.chainId;
  }

  enable() {
    return this.provider.request({ method: 'eth_requestAccounts' });
  }

  /**
   * Request user to change chain
   * @note If the error code (error.code) is 4902, then the requested chain has not been added by MetaMask, and you have to request to add it via addChain
   * @param chainId The 0x-non zero chainId or decimal number
   */
  switchChain(chainId: string | number) {
    const params = (typeof chainId === 'string')
      ? { chainId }
      : { chainId: `0x${chainId.toString(16)}` }
    return this.provider.request<null>({
      method: 'wallet_switchEthereumChain',
      params: [params]
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

  watchAsset(params: WatchAssetParams) {
    return this.provider.request<boolean>({
      method: 'wallet_watchAsset',
      params: [params]
    })
  }

  /** Listen on event from MetaMask Provider */
  protected fromMetaMaskEvent<T>(event: keyof MetaMaskEvents, initial?: T) {
    return fromEthEvent<T>(this.provider, this.ngZone, event, initial);
  }
}
