import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers";
import { ERC1155Factory } from "./contract";

@Injectable({ providedIn: "root" })
export class ERC1155FactoryManager extends ContractsManager<ERC1155Factory> {
  protected contractType = ERC1155Factory;
}
