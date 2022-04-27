import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ERC1193 } from '@ngeth/ethers';
import { IPFS, IPFSClient } from '@ngeth/ipfs';
import { OpenseaCollectionForm } from '@ngeth/opensea';
import { addresses } from '../../contracts';
import { FactoryManager } from '../../services/factory';

@Component({
  selector: 'ngeth-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent {
  form = new OpenseaCollectionForm();

  constructor(
    private factoryManager: FactoryManager,
    private route: ActivatedRoute,
    private router: Router,
    private erc1193: ERC1193,
    @Inject(IPFS) private ipfs: IPFSClient
  ) {}

  reset(event: Event) {
    event.preventDefault();
    this.form.reset();
  }

  async create() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { name, image } = this.form.value;
    this.form.disable();
    try {
      const content = JSON.stringify({ name, image });
      const res = await this.ipfs.add({ content });
      const factory = this.factoryManager.get(addresses.ERC1155Factory, this.erc1193.chainId);
      await factory.create(`ipfs://${res.path}`, '');
      this.router.navigate(['..'], { relativeTo: this.route });
    } catch(err) {
      console.error(err);
      this.form.enable();
    }
  }
}
