import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockExplorer } from '../../../explorer';
import { exist } from '../../../utils';
import { combineLatest } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { ContractAccount, isContract } from '@explorer';
import { Contract } from '@ethersproject/contracts';
import { WalletManager } from '../../../wallet';

@Component({
  selector: 'explorer-contract-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent {
  contract?: Contract;

  address$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('address')),
    filter(exist)
  );

  contract$ = combineLatest([this.explorer.addresses$, this.address$]).pipe(
    map(([addresses, address]) => addresses[address]),
    filter(isContract),
    map(contract => this.populate(contract)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  constructor(
    private explorer: BlockExplorer,
    private route: ActivatedRoute,
    private walletManager: WalletManager,
  ) {}

  private populate(contract: ContractAccount) {
    const receipts = contract.transactions.map(hash => this.explorer.source.receipts[hash]);
    const artifact = this.explorer.source.artifacts[contract.artifact];
    this.contract = new Contract(contract.address, artifact.abi, this.walletManager.signer);
    return { ...contract, receipts, artifact }
  }
}
