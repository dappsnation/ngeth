import { Injectable } from "@angular/core";
import { BaseERC1155, addresses } from './contracts';
import { MetaMask } from "@ngeth/ethers";

@Injectable({ providedIn: 'root' })
export class ERC1155 extends BaseERC1155 {
  constructor(metamask: MetaMask) {
    super(addresses.BaseERC1155, metamask.getSigner())
  }
}