import { Injectable } from '@angular/core';
import { MetaMask } from '@ngeth/ethers';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

interface ContractProfile {
  address: string;
  chainId: string;
  type: 'erc20' | 'erc721' | 'erc1155';
}

interface EthProfile {
  contracts: ContractProfile[]
}


@Injectable({ providedIn: 'root' })
export class EthStorage {
  private states$ = new BehaviorSubject<Record<string, EthProfile>>({});
  constructor(private metamask: MetaMask) {}

  get states() {
    return this.states$.getValue();
  }
  set states(states: Record<string, EthProfile>) {
    this.states$.next(states);
  }

  state$ = combineLatest([
    this.metamask.chainId$,
    this.metamask.account$,
    this.states$
  ]).pipe(
    map(([chain, account, states]) => states[this.key] ?? {})
  );
  
  get key() {
    return `${this.metamask.account}_${this.metamask.chainId}`;
  }

  async update(update: (item: EthProfile) => EthProfile | Promise<EthProfile>) {
    const state = this.getState();
    const result = await update(state);
    this.setState(result);
    localStorage.setItem(this.key, JSON.stringify(result));
  }

  set<K extends keyof EthProfile>(path: K, value: EthProfile[K]) {
    this.update(state => ({ ...state, [path]: value }));
  }

  setState(state: EthProfile) {
    this.states[this.key] = state;
  }

  // Might not work because the behavior subject
  getState() {
    if (!this.states[this.key]) {
      const content = localStorage.getItem(this.key);
      console.log(content);
      this.states[this.key] = JSON.parse(content ?? '{}');
    }
    return this.states[this.key];
  }
}