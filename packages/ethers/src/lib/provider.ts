import { inject, Inject, Injectable, InjectFlags, InjectionToken, NgZone, Optional } from '@angular/core';
import { JsonRpcProvider, getDefaultProvider, Provider } from '@ethersproject/providers';
import { BlockTag } from '@ethersproject/abstract-provider';
import { Networkish } from '@ethersproject/networks';
import { defer, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { fromEthEvent } from './events';


// export const ETH_URL = new InjectionToken<string>('URL of the node. Default is "http://localhost:8545"');
// export const PROVIDER = new InjectionToken<BaseProvider>('Ethereum Provider', {
//   providedIn: 'root',
//   factory: () => {
//     const url = inject(ETH_URL, InjectFlags.Optional);
//     return getDefaultProvider(url ?? 'http://localhost:8545');
//   }
// })

export function rpcProvider(network?: Networkish, options?: any) {
  return { provide: Provider, useFactory: () => getDefaultProvider(network, options) };
}

// @Injectable({ providedIn: 'root' })
// export class NgProvider extends JsonRpcProvider {
//   #events: Record<string, Observable<unknown>> = {};
//   private zone = inject(NgZone);

//   block$ = this.from<BlockTag>('block').pipe(
//     switchMap(number => this.getBlock(number))
//   );

//   constructor(@Optional() @Inject(ETH_URL) url?: string) {
//     super(url);
//   }

//   /**
//    * Listen on the changes of an event, starting with the current state
//    * @param event The event filter
//    */
//    from<T>(event: string): Observable<T> {
//     if (!this.#events[event]) {
//       this.#events[event] = defer(() => {
//         return fromEthEvent(this, this.zone, event);
//       });
//     }
//     return this.#events[event] as Observable<T>;
//   }
// }