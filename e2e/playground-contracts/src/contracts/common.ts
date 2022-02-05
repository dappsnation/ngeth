import { NgContract } from 'ngeth';
import type { EventFilter, Signer, Event } from 'ethers';
import type { Listener, Provider, BlockTag } from "@ethersproject/providers";
import type { Observable } from 'rxjs';

export type FilterParam<T> = T | T[] | null;
export interface TypedFilter<T> extends EventFilter {}
export interface TypedEvent<T extends (...args: any[]) => any> extends Event {
  args: Parameters<T>;
}
type ContractEvents<keys extends string> = {[name in keys]: Listener; };
type ContractFilters<keys extends string> = {[name in keys]: (...args: any[]) => TypedFilter<name>; };

export class TypedContract<
  Events extends ContractEvents<EventKeys>,
  Filters extends ContractFilters<EventKeys>,
  EventKeys extends Extract<keyof Events, string> = Extract<keyof Events, string>
> extends NgContract {
  override attach!: (addressOrName: string) => typeof this;
  override connect!: (providerOrSigner: Provider | Signer) => typeof this;
  deloyed?: () => Promise<typeof this>;

  // Observable
  override from!: <K extends EventKeys>(event: TypedFilter<K> | K) => Observable<Parameters<Events[K]>>;
  
  // Events
  override listenerCount!: (eventName?: EventFilter | EventKeys) => number;
  override listeners!: <K extends EventKeys>(eventName?: TypedFilter<K> | K) => Listener[];
  override off!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events[K]) => this;
  override on!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events[K]) => this;
  override once!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events[K]) => this;
  override removeListener!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events[K]) => this;
  override removeAllListeners!: (eventName?: EventFilter | EventKeys) => this;
  
  // FILTERS
  override filters!: Filters;
  override queryFilter!: <K extends EventKeys>(
    event: TypedFilter<K>,
    fromBlockOrBlockhash?: BlockTag,
    toBlock?: BlockTag,
  ) => Promise<TypedEvent<Events[K]>[]>
}
