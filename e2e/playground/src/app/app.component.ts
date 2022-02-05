import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ethers } from 'ethers';
import { MetaMask } from 'ngeth';
import { PlaygroundContract } from './playground.contract';

@Component({
  selector: 'nxeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form = new FormControl();
  account$ = this.metamask.account$;
  latestContribution$ = this.contract.from('Contribution');
  constructor(
    private metamask: MetaMask,
    private contract: PlaygroundContract
  ) {}

  connect() {
    this.metamask.enable();
  }

  async getTotal() {
    const total = await this.contract.total();
    console.log("total", total.toString());
  }

  async contribute(event: Event) {
    event.preventDefault();
    const eth = this.form.value as number;
    const tx = await this.contract.contribute({ value: ethers.utils.parseEther(`${eth}`) });
    await tx.wait();
  }

  async getContributions() {
    const contributions = await this.contract.queryFilter(this.contract.filters.Contribution())
    console.log(contributions.map(c => c.args));
  }
}
