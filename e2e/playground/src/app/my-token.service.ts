import { Injectable } from "@angular/core";
import { MyToken } from '@contracts/MyToken';
import { BigNumberish, constants } from "ethers";
import { MetaMask } from "ngeth";
import { switchMap, map } from "rxjs";

const exist = <T>(v?: T | null): v is T => v !== null && v !== undefined;

@Injectable({ providedIn: 'root' })
export class MyTokenContract extends MyToken {
  allTokens$ = this.from(this.filters.Transfer(constants.AddressZero));

  myTokens$ = this.metamask.account$.pipe(
    switchMap(address => this.from(this.filters.Transfer(undefined, address))),
    map(tokens => Array.from(new Set(tokens.map(token => token.tokenId)))),
    switchMap(async tokens => {
      const account = this.metamask.account;
      if (!account) return [] as BigNumberish[];
      const promises = tokens.map(token => this.ownerOf(token));
      const owners = await Promise.all(promises);
      const res = owners.map(([owner], i) => owner === account ? tokens[i] : null).filter(exist);
      return res;
    })
  );

  constructor(private metamask: MetaMask) {
    super(metamask.getSigner());
  }

}