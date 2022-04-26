import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers";
import { ERC1155Factory } from "./contract";

@Injectable({ providedIn: "root" })
export class ERC1155FactoryManager extends ContractsManager<ERC1155Factory> {
  createInstance(address: string) {
    return new ERC1155Factory(address, this.metamask.getSigner(), this.zone);
  }
}
