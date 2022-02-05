import { Inject, Injectable, InjectionToken, NgZone, Optional } from '@angular/core';
import { ExternalProvider, Web3Provider, Networkish, Provider } from '@ethersproject/providers';
import { EventFilter } from "@ethersproject/abstract-provider";
import { defer, Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}
interface ConnectInfo {
  chainId: string;
}
interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}
interface ProviderMessage {
  type: string;
  data: unknown;
}


interface MetaMaskEvents {
  accountsChanged: (accounts: string[]) => void;
  chainChanged: (chainId: string) => void;
  connect: (connectInfo: ConnectInfo) => void;
  disconnect: (error: ProviderRpcError) => void;
  message: (message: ProviderMessage) => void
}

interface MetaMaskProvider extends ExternalProvider {
  isConnected: boolean;
  chainId: string;
  networkVersion: string;
  selectedAddress?: string;
  enable(): Promise<string>;
  request(args: RequestArguments): Promise<unknown>;
  on<K extends keyof MetaMaskEvents>(event: K, listener: MetaMaskEvents[K]): this;
  once<K extends keyof MetaMaskEvents>(event: K, listener: MetaMaskEvents[K]): this;
  addListener<K extends keyof MetaMaskEvents>(event: K, listener: MetaMaskEvents[K]): this;
  removeListener<K extends keyof MetaMaskEvents>(event: K, listener: MetaMaskEvents[K]): this;
  removeAllListeners(event: keyof MetaMaskEvents): this;
}

const ETH_PROVIDER = new InjectionToken<MetaMaskProvider>('Ethereum ', {
  providedIn: 'root',
  factory: () => {
    if ('ethereum' in window) return (window as any).ethereum;
    throw new Error('No provider found in the window object. Is MetaMask enabled ?');
  }
});

const ETH_NETWORK = new InjectionToken<Networkish>('Ethereum Network');

export function fromEthEvent<T>(
  provider: Provider | MetaMaskProvider,
  zone: NgZone,
  event: string | EventFilter,
  initial?: any,
) {
  return new Observable<T>((subscriber) => {
    if (initial) zone.run(() => subscriber.next(initial as any));
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

  account$ = defer(() => {
    const initial = this.provider.selectedAddress ? [this.provider.selectedAddress] : [];
    return this.fromMetaMaskEvent<string[]>('accountsChanged', initial).pipe(
      map(accounts => accounts[0]),
      shareReplay(1),
    );
  });

  constructor(
    private ngZone: NgZone,
    @Inject(ETH_PROVIDER) provider: MetaMaskProvider,
    @Optional() @Inject(ETH_NETWORK) network?: Networkish,
  ) {
    super(provider, network);
  }


  /** Listen on event from MetaMask Provider */
  protected fromMetaMaskEvent<T>(event: keyof MetaMaskEvents, initial?: T) {
    return fromEthEvent<T>(this.provider, this.ngZone, event, initial);
  }
}


