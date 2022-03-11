/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BaseContract, EventFilter } from 'ethers';
import { Log } from '@ethersproject/abstract-provider';
import { Observable, shareReplay, switchMap, map } from 'rxjs';
import { fromEthEvent } from './metamask';
import { inject, NgZone } from '@angular/core';

import type { Signer, Event } from 'ethers';
import type { Listener, Provider, BlockTag } from "@ethersproject/providers";

export type FilterParam<T> = T | T[] | null;
export type TypedFilter<T> = EventFilter

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

  private ngZone = inject(NgZone);
  private _events: Record<string, Observable<any>> = {};

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


  /**
   * Listen on the changes of an event, starting with the current state
   * @param event The event filter
   */
  from<K extends FilterKeys>(event: TypedFilter<K> | K): Observable<EventArgs<Events, K>[]> {
    if (!this.provider) throw new Error('Provider required for event');
    const eventFilter = typeof event === 'string'
      ? this.getEventFilter(event)
      : event;
    const topic = eventFilter.topics?.[0];
    if (typeof topic !== 'string') throw new Error('Invalid topic');

    const tag = getEventTag(eventFilter);
    if (!this._events[tag]) {
      this._events[tag] = fromEthEvent<Log>(
        this.provider,
        this.ngZone,
        eventFilter
      ).pipe(
        switchMap(() => this.queryFilter(eventFilter)),
        map((events) => events.map((event) => event.args)),
        shareReplay(1)
      );
    }
    return this._events[tag];
  }
}
