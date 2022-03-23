/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BaseContract, EventFilter, ContractInterface } from '@ethersproject/contracts';
import { Log } from '@ethersproject/abstract-provider';
import { Observable, shareReplay, map, from, scan, startWith, combineLatest, finalize } from 'rxjs';
import { fromEthEvent } from './metamask';
import { inject, NgZone } from '@angular/core';

import type { Signer } from '@ethersproject/abstract-signer';
import type { Event } from '@ethersproject/contracts';
import type { Listener, Provider, BlockTag } from "@ethersproject/providers";
import type { BytesLike } from '@ethersproject/bytes';

export type FilterParam<T> = T | T[] | null;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TypedFilter<T> extends EventFilter {}

export type EventArgs<T extends ContractEvents<any, any>, K extends keyof T['filters']> = Parameters<T['events'][K]> & T['queries'][K];
export interface TypedEvent<T extends ContractEvents<any, any>, K extends keyof T['filters']> extends Event {
  args: EventArgs<T, K>;
}

interface ContractEvents<EventKeys extends string, FilterKeys extends string> {
  events: {[name in EventKeys]: Listener; }
  filters: {[name in FilterKeys]: (...args: any[]) => TypedFilter<name>; }
  queries: {[name in FilterKeys]: any }
}


function getEventTag(filter: EventFilter): string {
  const emptyTopics = !filter.topics || !filter.topics.length;
  if (filter.address && emptyTopics) return '*';

  const address = filter.address ?? '*';
  const topics = (filter.topics ?? []).map((topic) =>
    Array.isArray(topic) ? topic.join('|') : topic
  );
  return `${address}:${topics}`;
}

function flattenEvents(events: Event[]) {
  const record: Record<string, Event> = {};
  for (const event of events) {
    record[event.transactionHash] = event;
  }
  return Object.values(record);
} 



export class NgContract<
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

  private ngZone: NgZone;
  private _events: Record<string, Observable<any>> = {};

  constructor(
    address: string,
    abi: ContractInterface,
    signer?: Provider | Signer,
    ngZone?: NgZone,
  ) {
    super(address, abi, signer);
    this.ngZone = ngZone ?? inject(NgZone);
  }

  /** Transform event name into an EventFilter */
  private getEventFilter(name: string): EventFilter {
    if (name === 'error')
      throw new Error('"error" event is not implemented yet');
    if (name === 'event')
      throw new Error('"event" event is not implemented yet');
    if (name === '*') throw new Error('"*" event is not implemented yet');
    const fragment = this.interface.getEvent(name);
    const topic = this.interface.getEventTopic(fragment);
    return { address: this.address, topics: [topic] };
  }

  private wrapEvent(log: Log): TypedEvent<Events, FilterKeys> {
    const { name, signature, args, eventFragment } = this.interface.parseLog(log);
    return {
      ...log,
      getBlock: () => this.provider.getBlock(log.blockHash),
      getTransaction: () => this.provider.getTransaction(log.transactionHash),
      getTransactionReceipt: () => this.provider.getTransactionReceipt(log.transactionHash),
      decode: (data: BytesLike, topics?: Array<string>) => {
        return this.interface.decodeEventLog(eventFragment, data, topics);
      },
      event: name,
      eventSignature: signature,
      args: args
    } as TypedEvent<Events, FilterKeys>
  }

  /**
   * Listen on the changes of an event, starting with the current state
   * @param event The event filter
   */
  from<K extends FilterKeys>(event: TypedFilter<K> | K): Observable<TypedEvent<Events, K>[]> {
    if (!this.provider) throw new Error('Provider required for event');
    const eventFilter = typeof event === 'string'
      ? this.getEventFilter(event)
      : event;
    const topic = eventFilter.topics?.[0];
    if (typeof topic !== 'string') throw new Error('Invalid topic');

    const tag = getEventTag(eventFilter);
    if (!this._events[tag]) {
      const initial = this.queryFilter(eventFilter);
      const listener = fromEthEvent<Log>(
        this.provider,
        this.ngZone,
        eventFilter
      ).pipe(
        map(log => this.wrapEvent(log)),
        scan((acc, value) => acc.concat(value), [] as TypedEvent<Events, FilterKeys>[]),
        startWith([] as TypedEvent<Events, FilterKeys>[])
      );

      this._events[tag] = combineLatest([
        from(initial),
        listener,
      ]).pipe(
        map(([events, last]) => events.concat(...last)),
        map(flattenEvents), // remove duplicated (events seems to have a cache of 2 somehow...)
        finalize(() => delete this._events[tag]), // remove cache when no subscriber remains
        shareReplay({ refCount: true, bufferSize: 1 }),
      );
    }
    return this._events[tag];
  }
}
