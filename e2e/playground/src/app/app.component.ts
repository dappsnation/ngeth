import { Component } from '@angular/core';
import { MetaMask } from './metamask';
@Component({
  selector: 'nxeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'playground';
  account$ = this.metamask.account$;
  constructor(private metamask: MetaMask) {}

  connect() {
    this.metamask.provider.enable();
  }
}
