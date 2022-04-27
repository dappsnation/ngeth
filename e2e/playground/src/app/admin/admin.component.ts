import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getAddress } from '@ethersproject/address';

@Component({
  selector: 'ngeth-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  host: {
    class: 'page'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  search(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    const address = getAddress(input.value);
    this.router.navigate(['erc1155', address], { relativeTo: this.route });
    input.value = '';
  }
}
