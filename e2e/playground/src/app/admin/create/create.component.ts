import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaMask } from '@ngeth/ethers';
import { IPFS, IPFSClient } from '@ngeth/ipfs';
import { OpenseaCollection, OpenseaCollectionForm } from '@ngeth/opensea';
import { OpenseaERC1155Factory } from '../../contracts/contracts/OpenseaERC1155';

@Component({
  selector: 'nxeth-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent {
  form = new OpenseaCollectionForm();

  constructor(
    private metamask: MetaMask,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(IPFS) private ipfs: IPFSClient
  ) {}

  reset() {
    this.form.reset();
  }

  async create() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { name, image } = this.form.value;
    this.form.disable();
    const content = JSON.stringify({ name, image });
    const res = await this.ipfs.add({ content });
    const factory = new OpenseaERC1155Factory(this.metamask.getSigner());
    await factory.deploy(`ipfs://${res.path}`, '');
    // Todo: add snackbar message
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
