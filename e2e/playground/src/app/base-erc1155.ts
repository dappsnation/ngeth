import { Injectable } from "@angular/core";
import { BaseERC1155 } from '@contracts/BaseERC1155';
import { MetaMask } from "@ngeth/ethers";

@Injectable({ providedIn: 'root' })
export class ERC1155 extends BaseERC1155 {
  constructor(metamask: MetaMask) {
    super("0x5FbDB2315678afecb367f032d93F642f64180aa3", metamask.getSigner())
  }
}