import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MetaMask, ChainManager } from '@ngeth/ethers';
import { map, switchMap } from 'rxjs';
import { ERC1155 } from './base-erc1155';
import { addresses } from './contracts';

@Component({
  selector: 'nxeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  erc20 = addresses.BaseERC20;
  form = new FormGroup({
    address: new FormControl(),
    tokenId: new FormControl(),
    amount: new FormControl(),
  });
  connected$ = this.metamask.connected$;
  account$ = this.metamask.account$;
  chain$ = this.chain.chain$;

  tokens$ = this.metamask.account$.pipe(
    switchMap(address => this.contract.from(this.contract.filters.TransferSingle(null, null, address))),
    map(events => events.map(e => e.args))
  );

  constructor(
    private chain: ChainManager,
    private metamask: MetaMask,
    private contract: ERC1155,
  ) {}

  connect() {
    this.metamask.enable();
  }

  mint() {
    const { address, tokenId, amount } = this.form.value;
    this.contract.mint(address, tokenId, amount, '0x00');
  }

}
