import { Injectable } from '@angular/core';
import { Provider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WalletManager {
  #wallets: Record<string, Wallet> = {};
  #accounts = new BehaviorSubject<string[]>([]);
  #account = new ReplaySubject<string>();
  signer?: Wallet;

  accounts$ = this.#accounts.asObservable();
  account$ = this.#account.asObservable();

  constructor(private provider: Provider) {}

  get accounts() {
    return Object.keys(this.#wallets);
  }

  select(address: string) {
    if (address in this.#wallets) {
      this.#account.next(address);
      this.signer = this.#wallets[address];
    } else {
      throw new Error(`Address "${address}" is not a known address`);
    }
  }

  add(privateKey: string | string[]) {
    const add = (key: string) => {
      const wallet = new Wallet(key, this.provider);
      this.#wallets[wallet.address] = wallet;
    };
    Array.isArray(privateKey) ? privateKey.map(add) : add(privateKey);
    this.#accounts.next(this.accounts);
  }

  remove(address: string) {
    delete this.#wallets[address];
  }
}
