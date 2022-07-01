import { Component, ChangeDetectionStrategy } from '@angular/core';
import { addresses } from '../contracts';

@Component({
  selector: 'ngeth-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  erc1155 = addresses.hardhat.BaseERC1155;
}
