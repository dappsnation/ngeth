import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MetaMask, ChainManager } from '@ngeth/ethers';
import { addresses } from './contracts';

@Component({
  selector: 'nxeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  erc20 = addresses.BaseERC20;
  erc721 = addresses.BaseERC721;
  erc1155 = addresses.BaseERC1155;

  connected$ = this.metamask.connected$;
  account$ = this.metamask.account$;
  chain$ = this.chain.chain$;

  constructor(
    private chain: ChainManager,
    private metamask: MetaMask,
  ) {}

  connect() {
    this.metamask.enable();
  }

}
