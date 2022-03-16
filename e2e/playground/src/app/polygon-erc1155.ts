import { Injectable } from "@angular/core";
import { MetaMask } from "@ngeth/ethers";
import { ChildMintableERC1155 } from "@ngeth/polygon";

@Injectable({ providedIn: 'root' })
export class PolygonERC1155 extends ChildMintableERC1155 {
  constructor(private metamask: MetaMask) {
    super('0xf45dd761e7020e8fc06fc0e430cbecef77aff7f1', metamask.getSigner())
  }
}