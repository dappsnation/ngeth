import { Injectable } from "@angular/core";
import { MetaMask } from "@ngeth/ethers";
import { BaseERC1155Factory } from "../../contracts";

@Injectable({ providedIn: 'root' })
export class ERC1155Factory extends BaseERC1155Factory {
  constructor(metamask: MetaMask) {
    super(metamask.getSigner());
  }
}