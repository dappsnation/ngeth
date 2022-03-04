/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BaseContract, EventFilter } from 'ethers';
import { Log } from '@ethersproject/abstract-provider';
import { Observable, shareReplay, switchMap, map } from 'rxjs';
import { fromEthEvent } from './metamask';
import { inject, NgZone } from '@angular/core';

function getEventTag(filter: EventFilter): string {
  const emptyTopics = !filter.topics || !filter.topics.length;
  if (filter.address && emptyTopics) return '*';

  const address = filter.address ?? '*';
  const topics = (filter.topics ?? []).map((topic) =>
    Array.isArray(topic) ? topic.join('|') : topic
  );
  return `${address}:${topics}`;
}

export class NgContract extends BaseContract {
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

  from(event: EventFilter | string) {
    if (!this.provider) throw new Error('Provider required for event');
    const eventFilter =
      typeof event === 'string' ? this.getEventFilter(event) : event;
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
