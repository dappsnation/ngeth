import { Injectable } from "@angular/core";
import { ContractsManager, ngContract } from "@ngeth/ethers-angular";
import { Market } from "./contract";

@Injectable({ providedIn: "root" })
export class MarketManager extends ContractsManager<Market> {
  createInstance(address: string) {
    const contract = ngContract(Market);
    return new contract(address, this.signer, this.zone);
  }
}
