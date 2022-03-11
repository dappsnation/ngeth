import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MetaMask } from '@ngeth/core';
import { PolygonERC1155 } from './polygon-erc1155';

@Component({
  selector: 'nxeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form = new FormGroup({
    address: new FormControl(),
    tokenId: new FormControl(),
    amount: new FormControl(),
  });
  connected$ = this.metamask.connected$;
  account$ = this.metamask.account$;

  constructor(
    private metamask: MetaMask,
    private contract: PolygonERC1155
  ) {}

  connect() {
    this.metamask.enable();
  }

  mint() {
    const { address, tokenId, amount } = this.form.value;
    this.contract.mint(address, tokenId, amount, '0x00');
  }

  async hasRole() {
    const account = this.metamask.account;
    if (!account) throw new Error('You need to be authenticated');
    const role = await this.contract.DEFAULT_ADMIN_ROLE();
    const amount = await this.contract.getRoleMemberCount(role);
    console.log({ amount: amount.toNumber() });
    for (let i = 0; i < amount.toNumber(); i++) {
      const member = await this.contract.getRoleMember(role, i);
      console.log({ member });
    }
  }
}
