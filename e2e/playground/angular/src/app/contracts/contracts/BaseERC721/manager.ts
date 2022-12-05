import { Injectable } from "@angular/core";
import { ContractsManager, ngContract } from "@ngeth/ethers-angular";
import { BaseERC721 } from "./contract";

@Injectable({ providedIn: "root" })
export class BaseERC721Manager extends ContractsManager<BaseERC721> {
  createInstance(address: string) {
    const contract = ngContract(BaseERC721);
    return new contract(address, this.signer, this.zone);
  }
}
