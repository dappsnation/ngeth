import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { EthStore } from '@explorer';

import { io } from "socket.io-client";


@Injectable({ providedIn: 'root' })
export class BlockExplorer {
  #sourceChanges = new ReplaySubject<void>();
  source: EthStore = {
    blocks: [],
    states: [],
    transactions: {},
    receipts: {},
    addresses: {},
    logs: {},
    accounts: [],
    contracts: [],
    artifacts: {},
    builds: {}
  };
  blocks$ = this.#sourceChanges.pipe(map(() => this.source.blocks));
  txs$ = this.#sourceChanges.pipe(map(() => this.source.transactions));
  receipts$ = this.#sourceChanges.pipe(map(() => this.source.receipts));
  states$ = this.#sourceChanges.pipe(map(() => this.source.states));
  logs$ = this.#sourceChanges.pipe(map(() => this.source.logs));
  artifacts$ = this.#sourceChanges.pipe(map(() => this.source.artifacts));
  addresses$ = this.#sourceChanges.pipe(map(() => this.source.addresses));
  accounts$ = this.#sourceChanges.pipe(
    map(() => this.source.accounts.map(address => this.source.addresses[address]))
  );
  contracts$ = this.#sourceChanges.pipe(
    map(() => this.source.contracts.map(address => this.source.addresses[address]))
  );

  constructor() {
    this.init();
  }

  async init() {
    const res = await fetch('/assets/config.json');
    const { api } = await res.json();
    const socket = io(api);
    socket.on('block', (source: EthStore) => {
      this.source = source;
      this.#sourceChanges.next();
    })
  }
}
