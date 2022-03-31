import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ERC1155FormMint, MetaMask, ContractsManager } from '@ngeth/ethers';
import { BaseContract } from '../../services/manager';

@Component({
  selector: 'nxeth-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintComponent {
  form = new ERC1155FormMint();

  constructor(
    private metamask: MetaMask,
    private manager: ContractsManager<BaseContract>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get contract() {
    const address = this.route.snapshot.paramMap.get('address');
    if (!address) throw new Error('No address found in params');
    return this.manager.get(address, this.metamask.chainId);
  }

  
  async mint() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { to, tokenId, amount, data } = this.form.value;
    this.form.disable();
    try {
      const byteData = data ? `0x${data}` : '0x00';
      await this.contract.mint(to, tokenId, amount, byteData);
      this.router.navigate(['..'], { relativeTo: this.route });
    } catch(err) {
      console.error(err);
      this.form.enable();
    }
  }
}
