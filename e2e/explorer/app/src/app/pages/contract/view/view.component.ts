import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockExplorer } from '../../../explorer';
import { exist } from '../../../utils';
import { combineLatest } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { ContractAccount, isContract } from '@explorer';
import { Contract } from '@ethersproject/contracts';
import { WalletManager } from '../../../wallet';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'explorer-contract-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent {
  verifyForm = new FormGroup({
    constructorArguements: new FormControl(),
    contractname: new FormControl(),
    sourceCode: new FormControl(),
  });
  contract?: Contract;

  address$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('address')),
    filter(exist)
  );

  contract$ = combineLatest([this.explorer.addresses$, this.address$]).pipe(
    map(([addresses, address]) => addresses[address]),
    filter(isContract),
    withLatestFrom(this.walletManager.account$), // used to change the contract signer
    map(([contract]) => this.populate(contract)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor(
    private explorer: BlockExplorer,
    private route: ActivatedRoute,
    private walletManager: WalletManager,
  ) {}

  private populate(contract?: ContractAccount) {
    if (!contract?.artifact) return;
    const artifact = this.explorer.source.artifacts[contract.artifact];
    const receipts = contract.transactions.map(hash => this.explorer.source.receipts[hash]);
    this.contract = new Contract(contract.address, artifact.abi, this.walletManager.signer);
    return { ...contract, receipts, artifact }
  }

  verify() {
    if (this.verifyForm.invalid) return this.verifyForm.markAllAsTouched();
    const params = {
      module: 'contract',
      action: 'verifysourcecode',
      contractaddress: this.route.snapshot.paramMap.get('address'),
      ...this.verifyForm.value
    };
    fetch('http://localhost:3000/etherscan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
    });
  }
}
