import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAddress } from '@ethersproject/address';
import { MetaMask } from '@ngeth/ethers';

@Component({
  selector: 'nxeth-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metamask: MetaMask
  ) {}

  search(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    const address = getAddress(input.value);
    this.router.navigate(['erc1155', address], { relativeTo: this.route });
    input.value = '';
  }
}
