import { Injectable } from "@angular/core";
import { MyToken } from '@contracts/MyToken';
import { MetaMask, address0 } from "ngeth";
import { switchMap, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MyTokenContract extends MyToken {
  allTokens$ = this.from(this.filters.Transfer(address0));

  myTokens$ = this.metamask.account$.pipe(
    switchMap(address => this.from(this.filters.Transfer(undefined, address))),
    map(tokens => Array.from(new Set(tokens.map(token => token.tokenId)))),
  );

  constructor(private metamask: MetaMask) {
    super(metamask.getSigner());
  }

}