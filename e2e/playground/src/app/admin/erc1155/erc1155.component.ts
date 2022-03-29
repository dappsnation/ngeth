import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractsManager, ERC1155FormMint, MetaMask } from '@ngeth/ethers';
import { map, pluck } from 'rxjs/operators';

@Component({
  selector: 'nxeth-erc1155',
  templateUrl: './erc1155.component.html',
  styleUrls: ['./erc1155.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Erc1155Component {
  form = new ERC1155FormMint();
  contract$ = this.route.params.pipe(
    pluck('address'),
    map((address: string) => this.contracts.erc1155(address))
  );

  constructor(
    private metamask: MetaMask,
    private contracts: ContractsManager,
    private route: ActivatedRoute,
  ) {}

  get contract() {
    const address = this.route.snapshot.paramMap.get('address');
    if (!address) throw new Error('No address found in params');
    return this.contracts.erc1155(address);
  }

  mint() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { to, tokenId, amount, data } = this.form.value;
    // TODO: hexify this
    const byteData = `0x${data}`;
    this.contract.mint(to, tokenId, amount, '0x00');
  }
}
