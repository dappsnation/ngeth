import { Injectable } from "@angular/core";
import { ContractsManager, ngContract } from "@ngeth/ethers-angular";
import { BaseERC1155 } from "./contract";

@Injectable({ providedIn: "root" })
export class BaseERC1155Manager extends ContractsManager<BaseERC1155> {
  createInstance(address: string) {
    const contract = ngContract(BaseERC1155);
    return new contract(address, this.signer, this.zone);
  }
}
