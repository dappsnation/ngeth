import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContractsManager, ERC20FormTransfer, MetaMask, parseERC20 } from '@ngeth/ethers';
import { combineLatest, firstValueFrom, map, pluck, switchMap } from 'rxjs';

@Component({
  selector: 'nxeth-erc20',
  templateUrl: './erc20.component.html',
  styleUrls: ['./erc20.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Erc20Component {
  form = new ERC20FormTransfer();

  address$ = this.route.params.pipe(pluck('address'));
  contract$ = combineLatest([ this.address$, this.metamask.chain$ ]).pipe(
    map(([address]) => this.contracts.erc20(address))
  );

  exist$ = this.contract$.pipe(
    switchMap(contract => contract.exist())
  );
  balance$ = combineLatest([ this.contract$, this.metamask.account$ ]).pipe(
    switchMap(([contract, address]) => contract.balanceChanges(address))
  );
  metadata$ = this.contract$.pipe(
    switchMap(contract => contract.getMetadata())
  );

  constructor(
    private contracts: ContractsManager,
    private metamask: MetaMask,
    private route: ActivatedRoute,
  ) {}

  get contract() {
    const {address} = this.route.snapshot.params;
    return this.contracts.erc20(address);
  }

  async watch() {
    const { symbol, decimals } = await this.contract.getMetadata();
    const { address } = this.route.snapshot.params;
    this.metamask.watchAsset({ address, symbol, decimals });
  }

  async transfer() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { to, amount } = this.form.value;
    const metadata = await this.contract.getMetadata();
    this.contract.transfer(to, parseERC20(amount, metadata));
  }
}
