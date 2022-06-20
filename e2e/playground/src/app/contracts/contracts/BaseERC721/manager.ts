import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers-angular";
import { BaseERC721 } from "./contract";

@Injectable({ providedIn: "root" })
export class BaseERC721Manager extends ContractsManager<BaseERC721> {
  createInstance(address: string) {
    return new BaseERC721(address, this.signer, this.zone);
  }
}
