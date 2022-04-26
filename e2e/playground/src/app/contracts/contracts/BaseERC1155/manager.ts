import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers";
import { BaseERC1155 } from "./contract";

@Injectable({ providedIn: "root" })
export class BaseERC1155Manager extends ContractsManager<BaseERC1155> {
  createInstance(address: string) {
    return new BaseERC1155(address, this.metamask.getSigner(), this.zone);
  }
}
