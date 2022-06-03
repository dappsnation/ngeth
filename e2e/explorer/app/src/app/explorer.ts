import { Injectable } from '@angular/core';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { BlockchainState, EthAccount } from '@explorer';

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
  source: BlockchainState = {
    blocks: [],
    transactions: {},
    addresses: {},
    states: [],
    abis: {}
  };
  blocks$ = this.#sourceChanges.pipe(map(() => this.source.blocks));
  txs$ = this.#sourceChanges.pipe(map(() => this.source.transactions));
  states$ = this.#sourceChanges.pipe(map(() => this.source.states));
  accounts$ = this.#sourceChanges.pipe(
    map(() => filterAccounts(this.source.addresses))
  );
  contracts$ = this.#sourceChanges.pipe(
    map(() => filterContracts(this.source.addresses))
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
