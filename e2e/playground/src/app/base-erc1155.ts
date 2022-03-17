import { Injectable } from "@angular/core";
import { BaseERC1155 } from '@contracts/BaseERC1155';
import { MetaMask } from "@ngeth/ethers";

@Injectable({ providedIn: 'root' })
export class ERC1155 extends BaseERC1155 {
  constructor(metamask: MetaMask) {
    super("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", metamask.getSigner())
  }
}