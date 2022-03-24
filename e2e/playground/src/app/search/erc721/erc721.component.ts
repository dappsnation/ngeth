import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractsManager, ERC721FormTransfer, MetaMask } from '@ngeth/ethers';
import { combineLatest, map, pluck, switchMap } from 'rxjs';

@Component({
  selector: 'nxeth-erc721',
  templateUrl: './erc721.component.html',
  styleUrls: ['./erc721.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Erc721Component {
  form = new ERC721FormTransfer();

  address$ = this.route.params.pipe(pluck('address'));
  contract$ = combineLatest([ this.address$, this.metamask.chain$ ]).pipe(
    map(([address]) => this.contracts.erc721(address))
  );

  exist$ = this.contract$.pipe(
    switchMap(contract => contract.exist())
  );
  tokens$ = combineLatest([ this.contract$, this.metamask.account$ ]).pipe(
    switchMap(([contract, address]) => contract.tokensChanges(address))
  );


  constructor(
    private contracts: ContractsManager,
    private metamask: MetaMask,
    private route: ActivatedRoute,
  ) {}

  get contract() {
    const {address} = this.route.snapshot.params;
    return this.contracts.erc721(address);
  }

  async transfer() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { from = this.metamask.account, to, tokenId } = this.form.value;
    // TODO: Create a error handler for "need to be connected"
    if (!from) return;
    this.contract.safeTransferFrom(from, to, tokenId);
  }
}
