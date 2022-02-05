/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BaseContract, Event, EventFilter, BytesLike } from "ethers";
import { Log } from "@ethersproject/abstract-provider";
import { EventFragment } from "ethers/lib/utils";
import { map, Observable, shareReplay } from "rxjs";
import { fromEthEvent } from "./metamask";
import { inject, NgZone } from "@angular/core";

function getEventTag(filter: EventFilter): string {
  const emptyTopics = !filter.topics || !filter.topics.length;
  if (filter.address && emptyTopics) return "*";

  const address = filter.address ?? '*';
  const topics = (filter.topics ?? []).map(topic => Array.isArray(topic) ? topic.join('|') : topic);
  return `${address}:${topics}`;
}

export class NgContract extends BaseContract {
  private ngZone = inject(NgZone);
  private _events: Record<string, Observable<any>> = {};

  private logToEvent(log: Log, fragment: EventFragment): Event {
    return {
      ...log,
      event: fragment.name,
      eventSignature: fragment.format(),
      args: this.interface.decodeEventLog(fragment, log.data, log.topics),
      getBlock: () => this.provider!.getBlock(log.blockHash),
      getTransaction: () => this.provider!.getTransaction(log.transactionHash),
      getTransactionReceipt: () => this.provider!.getTransactionReceipt(log.transactionHash),
      decode: (data: BytesLike, topics?: Array<string>) => {
        return this.interface.decodeEventLog(fragment, data, topics);
      },
      // Required for Event, but not used as events are managed by Observable
      removeListener: () => undefined
    }
  }

  /** Transform event name into an EventFilter */
  private getEventFilter(name: string): EventFilter {
    if (name === 'error') throw new Error('"error" event is not implemented yet');
    if (name === 'event') throw new Error('"event" event is not implemented yet');
    if (name === '*') throw new Error('"*" event is not implemented yet');
    const fragment = this.interface.getEvent(name);
    const topic = this.interface.getEventTopic(fragment);
    return { address: this.address, topics: [topic] }
  }

  from(event: EventFilter | string) {
    if (!this.provider) throw new Error('Provider required for event');
    const eventFilter = typeof event === 'string' ? this.getEventFilter(event) : event;
    const topic = eventFilter.topics?.[0];
    if (typeof topic !== 'string') throw new Error("Invalid topic");
    const fragment = this.interface.getEvent(topic);
    const tag = getEventTag(eventFilter);
    if (!this._events[tag]) {
      this._events[tag] = fromEthEvent<Log>(this.provider, this.ngZone, eventFilter).pipe(
        map(log => this.logToEvent(log, fragment).args),
        shareReplay(1)
      );
    }
    return this._events[tag];
  }
}