import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractsManager, ERC1155FormTransfer, NgERC1193 } from '@ngeth/ethers-angular';
import { combineLatest, map, pluck, switchMap, withLatestFrom } from 'rxjs';
import { BaseContract } from '../../services/manager';

@Component({
  selector: 'ngeth-erc1155',
  templateUrl: './erc1155.component.html',
  styleUrls: ['./erc1155.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Erc1155Component {
  form = new ERC1155FormTransfer();

  address$ = this.route.params.pipe(pluck('address'));
  contract$ = combineLatest([ this.address$, this.erc1193.chainId$ ]).pipe(
    map(([address, chainId]) => this.contracts.get(address, chainId))
  );

  exist$ = this.contract$.pipe(
    switchMap(contract => contract.exist())
  );
  tokens$ = combineLatest([ this.contract$, this.erc1193.currentAccount$ ]).pipe(
    switchMap(([contract, address]) => contract.tokensChanges(address))
  );
  isOwner$ = this.contract$.pipe(
    switchMap(contract => contract.owner()),
    withLatestFrom(this.erc1193.currentAccount$),
    map(([owner, account]) => owner.toLocaleLowerCase() === account.toLocaleLowerCase())
  );

  constructor(
    private contracts: ContractsManager<BaseContract>,
    private erc1193: NgERC1193,
    private route: ActivatedRoute,
  ) {}

  get contract() {
    const {address} = this.route.snapshot.params;
    if (!this.erc1193.chainId) throw new Error('No chainId found');
    return this.contracts.get(address, this.erc1193.chainId);
  }

  async transfer() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { from = this.erc1193.account, to, tokenId, amount } = this.form.value;
    // TODO: Create a error handler for "need to be connected"
    if (!from || !to || !tokenId || !amount) return;
    this.contract.safeTransferFrom(from, to, tokenId, amount, '0x00');
  }
}
