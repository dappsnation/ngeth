import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ERC1155FormMint, ContractsManager } from '@ngeth/ethers';
import { MetaMask } from '@ngeth/metamask';
import { IPFS, IPFSClient } from '@ngeth/ipfs';
import { OpenseaTokenForm } from '@ngeth/opensea';
import { BaseContract } from '../../services/manager';

@Component({
  selector: 'ngeth-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintComponent {
  attributeType = new FormControl();
  form = new FormGroup({
    metadata: new OpenseaTokenForm(),
    mint: new ERC1155FormMint()
  })

  constructor(
    @Inject(IPFS) private ipfs: IPFSClient,
    private metamask: MetaMask,
    private manager: ContractsManager<BaseContract>,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  get metadata() {
    return this.form.get('metadata') as OpenseaTokenForm;
  }

  get contract() {
    const address = this.route.snapshot.paramMap.get('address');
    if (!address) throw new Error('No address found in params');
    if (!this.metamask.chainId) throw new Error('No chainId found');
    return this.manager.get(address, this.metamask.chainId);
  }

  addAttribute(event: Event) {
    event.preventDefault();
    const display_type = this.attributeType.value;
    this.metadata.addAttribute({ display_type });
    this.attributeType.reset();
  }

  reset(event: Event) {
    event.preventDefault();
    this.form.reset();
  }
  
  async mint() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { metadata, mint } = this.form.value;
    const { to, tokenId, amount, data } = mint;
    this.form.disable();
    try {
      const content = JSON.stringify(metadata);
      const { cid } = await this.ipfs.add({ content });
      const byteData = data ? `0x${data}` : '0x00';
      await this.contract.mint(to, tokenId, amount, byteData);
      this.router.navigate(['..'], { relativeTo: this.route });
    } catch(err) {
      console.error(err);
      this.form.enable();
    }
  }
}
