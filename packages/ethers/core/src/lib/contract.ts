/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BaseContract, EventFilter } from '@ethersproject/contracts';

import type { Signer } from '@ethersproject/abstract-signer';
import type { Event } from '@ethersproject/contracts';
import type { Listener, Provider, BlockTag } from "@ethersproject/providers";

export type FilterParam<T> = T | T[] | null;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TypedFilter<T> extends EventFilter {}

export type EventArgs<T extends ContractEvents<any, any>, K extends keyof T['filters']> = Parameters<T['events'][K]> & T['queries'][K];
export interface TypedEvent<T extends ContractEvents<any, any>, K extends keyof T['filters']> extends Event {
  args: EventArgs<T, K>;
}

export interface ContractEvents<EventKeys extends string, FilterKeys extends string> {
  events: {[name in EventKeys]: Listener; }
  filters: {[name in FilterKeys]: (...args: any[]) => TypedFilter<name>; }
  queries: {[name in FilterKeys]: any }
}

export class EthersContract<
  Events extends ContractEvents<EventKeys, FilterKeys>,
  EventKeys extends Extract<keyof Events['events'], string> = Extract<keyof Events['events'], string>,
  FilterKeys extends Extract<keyof Events['filters'], string> = Extract<keyof Events['filters'], string>,
> extends BaseContract {  
  
  // FILTERS
  override filters!: Events['filters'];
  override queryFilter!: <K extends FilterKeys>(
    event: TypedFilter<K>,
    fromBlockOrBlockhash?: BlockTag,
    toBlock?: BlockTag,
  ) => Promise<TypedEvent<Events, K>[]>;

  override attach!: (addressOrName: string) => this;
  override connect!: (providerOrSigner: Provider | Signer) => this;
  deloyed?: () => Promise<this>;
  
  // Events
  override listenerCount!: (eventName?: EventFilter | EventKeys) => number;
  override listeners!: <K extends EventKeys>(eventName?: TypedFilter<K> | K) => Listener[];
  override off!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override on!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override once!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override removeListener!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override removeAllListeners!: (eventName?: EventFilter | EventKeys) => this;
}
