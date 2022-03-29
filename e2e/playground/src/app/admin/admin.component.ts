import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MetaMask } from '@ngeth/ethers';
import { EthStorage } from '../storage';
import { ERC1155Factory } from './erc1155/factory';

@Component({
  selector: 'nxeth-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {

  constructor(
    private metamask: MetaMask,
    private erc1155Factory: ERC1155Factory,
    private storage: EthStorage
  ) {}

  async create() {
    const contract = await this.erc1155Factory.deploy('uri');
    await contract.deployTransaction?.wait();
    this.storage.update((state) => {
      if (!state.contracts) state.contracts = [];
      state.contracts.push({
        address: contract.address,
        chainId: this.metamask.chainId,
        type: 'erc1155'
      });
      return state;
    });
  }
}
