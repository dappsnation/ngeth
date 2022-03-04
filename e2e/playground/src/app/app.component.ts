import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BigNumberish } from 'ethers';
import { MetaMask } from '@ngeth/core';
import { MyTokenContract } from './my-token.service';

@Component({
  selector: 'nxeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form = new FormGroup({
    address: new FormControl(),
    tokenId: new FormControl(),
    url: new FormControl(),
  });
  connected$ = this.metamask.connected$;
  account$ = this.metamask.account$;
  tokens$ = this.contract.allTokens$;
  myTokens$ = this.contract.myTokens$;

  constructor(private metamask: MetaMask, private contract: MyTokenContract) {}

  connect() {
    this.metamask.enable();
  }

  mint() {
    const { address, tokenId, url } = this.form.value;
    this.contract.safeMint(address, tokenId, url);
  }

  transfer(event: Event, tokenId: BigNumberish, to: string) {
    event.preventDefault();
    const from = this.metamask.account;
    if (!from) return;
    this.contract['safeTransferFrom(address,address,uint256)'](
      from,
      to,
      tokenId
    );
  }
}
