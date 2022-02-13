import { Injectable } from '@angular/core';
import { Market } from '@contracts/Market';
import { MetaMask } from 'ngeth';
import { switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MarketContract extends Market {

  constructor(private metamask: MetaMask) {
    super(metamask.getSigner());
  }
  
  contracts$ = this.metamask.account$.pipe(
    switchMap(account => this.from('UpsertOffer'))
  );
}