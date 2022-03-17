import {
  Inject,
  Injectable,
  InjectionToken,
  NgZone,
  Optional,
} from '@angular/core';
import {
  ExternalProvider,
  Web3Provider,
  Networkish,
  Provider,
} from '@ethersproject/providers';
import { EventFilter } from '@ethersproject/abstract-provider';
import { timer, defer, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, filter } from 'rxjs/operators';
import { getAddress } from 'ethers/lib/utils';

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
  message: (message: ProviderMessage) => void;
}

interface MetaMaskProvider extends ExternalProvider {
  chainId: string;
  networkVersion: string;
  selectedAddress?: string;
  isConnected(): boolean;
  enable(): Promise<string>;
  send(args: RequestArguments | 'eth_requestAccounts'): Promise<unknown>;
  request(args: RequestArguments | 'eth_requestAccounts'): Promise<unknown>;
  on<K extends keyof MetaMaskEvents>(
    event: K,
    listener: MetaMaskEvents[K]
  ): this;
  once<K extends keyof MetaMaskEvents>(
    event: K,
    listener: MetaMaskEvents[K]
  ): this;
  addListener<K extends keyof MetaMaskEvents>(
    event: K,
    listener: MetaMaskEvents[K]
  ): this;
  removeListener<K extends keyof MetaMaskEvents>(
    event: K,
    listener: MetaMaskEvents[K]
  ): this;
  removeAllListeners(event: keyof MetaMaskEvents): this;
}

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
      shareReplay(1)
    );
  });

  account$ = defer(() => {
    // Sometime Metamask takes time to find selected Address. Delay in this case
    const start = this.account
      ? of([this.account])
      : timer(500).pipe(map(() => (this.account ? [this.account] : [])));
    return start.pipe(
      switchMap((initial) => this.fromMetaMaskEvent('accountsChanged', initial)),
      filter(accounts => !!accounts.length),
      map(accounts => getAddress(accounts[0])),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  });

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

  enable() {
    return this.provider.send('eth_requestAccounts');
  }

  /** Listen on event from MetaMask Provider */
  protected fromMetaMaskEvent<T>(event: keyof MetaMaskEvents, initial?: T) {
    return fromEthEvent<T>(this.provider, this.ngZone, event, initial);
  }
}
