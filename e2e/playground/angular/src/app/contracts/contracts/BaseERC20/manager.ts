import { Injectable } from "@angular/core";
import { ContractsManager, ngContract } from "@ngeth/ethers-angular";
import { BaseERC20 } from "./contract";

@Injectable({ providedIn: "root" })
export class BaseERC20Manager extends ContractsManager<BaseERC20> {
  createInstance(address: string) {
    const contract = ngContract(BaseERC20);
    return new contract(address, this.signer, this.zone);
  }
}
