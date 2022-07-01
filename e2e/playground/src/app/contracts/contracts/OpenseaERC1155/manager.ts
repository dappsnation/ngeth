import { Injectable } from "@angular/core";
import { ContractsManager, ngContract } from "@ngeth/ethers-angular";
import { OpenseaERC1155 } from "./contract";

@Injectable({ providedIn: "root" })
export class OpenseaERC1155Manager extends ContractsManager<OpenseaERC1155> {
  createInstance(address: string) {
    const contract = ngContract(OpenseaERC1155);
    return new contract(address, this.signer, this.zone);
  }
}
