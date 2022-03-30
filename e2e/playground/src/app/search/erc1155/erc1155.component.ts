import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractsManager, ERC1155FormTransfer, MetaMask } from '@ngeth/ethers';
import { combineLatest, map, pluck, switchMap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'nxeth-erc1155',
  templateUrl: './erc1155.component.html',
  styleUrls: ['./erc1155.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Erc1155Component {
  form = new ERC1155FormTransfer();


  address$ = this.route.params.pipe(pluck('address'));
  contract$ = combineLatest([ this.address$, this.metamask.chain$ ]).pipe(
    map(([address]) => this.contracts.erc1155(address))
  );

  exist$ = this.contract$.pipe(
    switchMap(contract => contract.exist())
  );
  tokens$ = combineLatest([ this.contract$, this.metamask.currentAccount$ ]).pipe(
    switchMap(([contract, address]) => contract.tokensChanges(address))
  );
  isOwner$ = this.contract$.pipe(
    switchMap(contract => contract.owner()),
    withLatestFrom(this.metamask.currentAccount$),
    map(([owner, account]) => owner.toLocaleLowerCase() === account.toLocaleLowerCase())
  );

  constructor(
    private contracts: ContractsManager,
    private metamask: MetaMask,
    private route: ActivatedRoute,
  ) {}

  get contract() {
    const {address} = this.route.snapshot.params;
    return this.contracts.erc1155(address);
  }

  async transfer() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { from = this.metamask.account, to, tokenId, amount } = this.form.value;
    // TODO: Create a error handler for "need to be connected"
    if (!from) return;
    this.contract.safeTransferFrom(from, to, tokenId, amount, '0x00');
  }
}