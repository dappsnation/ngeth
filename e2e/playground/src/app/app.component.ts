import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgERC1193 } from '@ngeth/ethers-angular';

@Component({
  selector: 'ngeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    private router: Router,
    private erc1193: NgERC1193
  ) {}

  redirect(path: string) {
    this.router.navigate([path]);
  }
}
