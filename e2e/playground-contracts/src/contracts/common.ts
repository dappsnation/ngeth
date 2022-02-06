import { NgContract } from 'ngeth';
import type { EventFilter, Signer, Event } from 'ethers';
import type { Listener, Provider, BlockTag } from "@ethersproject/providers";
import type { Observable } from 'rxjs';

export type FilterParam<T> = T | T[] | null;
export interface TypedFilter<T> extends EventFilter {}


export type EventArgs<T extends ContractEvents<any, any>, K extends keyof T['filters']> = Parameters<T['filters'][K]> & T['queries'][K];
export interface TypedEvent<T extends ContractEvents<any, any>, K extends keyof T['filters']> extends Event {
  args: EventArgs<T, K>;
}

interface ContractEvents<EventKeys extends string, FilterKeys extends string> {
  events: {[name in EventKeys]: Listener; }
  filters: {[name in FilterKeys]: (...args: any[]) => TypedFilter<name>; }
  queries: {[name in FilterKeys]: any }
}

export class TypedContract<
  Events extends ContractEvents<EventKeys, FilterKeys>,
  EventKeys extends Extract<keyof Events['events'], string> = Extract<keyof Events['events'], string>,
  FilterKeys extends Extract<keyof Events['filters'], string> = Extract<keyof Events['filters'], string>,
> extends NgContract {
  override attach!: (addressOrName: string) => typeof this;
  override connect!: (providerOrSigner: Provider | Signer) => typeof this;
  deloyed?: () => Promise<typeof this>;
  
  // Events
  override listenerCount!: (eventName?: EventFilter | EventKeys) => number;
  override listeners!: <K extends EventKeys>(eventName?: TypedFilter<K> | K) => Listener[];
  override off!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override on!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override once!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override removeListener!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override removeAllListeners!: (eventName?: EventFilter | EventKeys) => this;
  
  // FILTERS
  override filters!: Events['filters'];
  override queryFilter!: <K extends FilterKeys>(
    event: TypedFilter<K>,
    fromBlockOrBlockhash?: BlockTag,
    toBlock?: BlockTag,
  ) => Promise<TypedEvent<Events, K>[]>;

  // Observable
  override from!: <K extends FilterKeys>(event: TypedFilter<K> | K) => Observable<EventArgs<Events, K>[]>;
}
