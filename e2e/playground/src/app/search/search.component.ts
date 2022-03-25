import { Component, ChangeDetectionStrategy } from '@angular/core';
import { addresses } from '../contracts';

@Component({
  selector: 'nxeth-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  erc20 = addresses.BaseERC20;
  erc721 = addresses.BaseERC721;
  erc1155 = addresses.BaseERC1155;
}
