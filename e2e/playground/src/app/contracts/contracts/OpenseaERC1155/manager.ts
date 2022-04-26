import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers";
import { OpenseaERC1155 } from "./contract";

@Injectable({ providedIn: "root" })
export class OpenseaERC1155Manager extends ContractsManager<OpenseaERC1155> {
  createInstance(address: string) {
    return new OpenseaERC1155(address, this.metamask.getSigner(), this.zone);
  }
}
