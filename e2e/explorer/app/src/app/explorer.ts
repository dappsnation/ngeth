import { Injectable } from '@angular/core';
import { firstValueFrom, fromEvent, ReplaySubject, Subject } from 'rxjs';
import { map, filter, shareReplay, tap } from 'rxjs/operators';
import { BlockchainState } from '@explorer';

import { io } from "socket.io-client";


@Injectable({ providedIn: 'root' })
export class BlockExplorer {
  #sourceChanges = new ReplaySubject<void>();
  source: BlockchainState = {
    blocks: [],
    transactions: {},
    addresses: {},
    states: [],
  };
  blocks$ = this.#sourceChanges.pipe(
    map(() => this.source.blocks),
  );
  txs$ = this.#sourceChanges.pipe(
    map(() => this.source.transactions),
  );
  addresses$ = this.#sourceChanges.pipe(
    map(() => this.source.addresses),
  );
  states$ = this.#sourceChanges.pipe(
    map(() => this.source.states),
  );

  constructor() {
    const socket = io('http://localhost:3333');
    socket.on('block', source => {
      this.source = source;
      this.#sourceChanges.next();
    })
  }

  async get<K extends keyof BlockchainState>(key: K, value: keyof BlockchainState[K]) {
    if (value in this.source[key]) return this.source[key][value];
    const obs = this.#sourceChanges.pipe(
      filter(() => value in this.source[key]),
      map(() => this.source[key][value])
    );
    return firstValueFrom(obs);
  }
}
