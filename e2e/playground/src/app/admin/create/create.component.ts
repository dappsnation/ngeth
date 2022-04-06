import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaMask } from '@ngeth/ethers';
import { IPFS, IPFSClient } from '@ngeth/ipfs';
import { OpenseaCollectionForm } from '@ngeth/opensea';
import { OpenseaERC1155Factory, OpenseaERC1155Abi } from '../../contracts/contracts/OpenseaERC1155';
import { ContractCollection, toContract } from '../../services/contract.collection';

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
    private contractCollection: ContractCollection,
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
  
      const factory = new OpenseaERC1155Factory(this.metamask.getSigner());
      const { deployTransaction, address } = await factory.deploy(`ipfs://${res.path}`, '');
      const contract = toContract({
        address,
        transaction: deployTransaction,
        standard: 'erc1155',
        abi: OpenseaERC1155Abi
      });
      await this.contractCollection.add(contract);
      
      // Todo: add snackbar message
      deployTransaction.wait()
        .then(() => this.metamask.getTransaction(deployTransaction.hash)
        .then((transaction) => this.contractCollection.update(address, toContract({ transaction }))));
      
      this.router.navigate(['..'], { relativeTo: this.route });
    } catch(err) {
      console.error(err);
      this.form.enable();
    }
  }
}
