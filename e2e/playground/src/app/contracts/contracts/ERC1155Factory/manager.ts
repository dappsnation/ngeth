import { Injectable } from "@angular/core";
import { ContractsManager, ngContract } from "@ngeth/ethers-angular";
import { ERC1155Factory } from "./contract";

@Injectable({ providedIn: "root" })
export class ERC1155FactoryManager extends ContractsManager<ERC1155Factory> {
  createInstance(address: string) {
    const contract = ngContract(ERC1155Factory);
    return new contract(address, this.signer, this.zone);
  }
}
