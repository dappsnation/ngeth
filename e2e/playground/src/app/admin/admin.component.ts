import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ERC1155Factory } from './erc1155/factory';

@Component({
  selector: 'nxeth-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {

  constructor(private erc1155Factory: ERC1155Factory) {}

  async create() {
    const contract = await this.erc1155Factory.deploy('uri');
    await contract.deployTransaction?.wait();
    localStorage.setItem('contracts', JSON.stringify([contract.address]));
  }
}
