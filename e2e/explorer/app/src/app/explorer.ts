import { Injectable } from '@angular/core';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { EthAccount, EthStore } from '@explorer';

import { io } from "socket.io-client";

const filterAddress = (keepContract: boolean) => (record: Record<string, EthAccount>) => {
  const result: Record<string, EthAccount> = {};
  for (const address in record) {
    if (record[address].isContract === keepContract) result[address] = record[address];
  }
  return result;
}
const filterAccounts = filterAddress(false);
const filterContracts= filterAddress(true);

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
    artifacts: {}
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

  // async get<K extends keyof BlockchainState>(key: K, value: keyof BlockchainState[K]) {
  //   if (value in this.source[key]) return this.source[key][value];
  //   const obs = this.#sourceChanges.pipe(
  //     filter(() => value in this.source[key]),
  //     map(() => this.source[key][value])
  //   );
  //   return firstValueFrom(obs);
  // }
}
