import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers-angular";
import { Market } from "./contract";

@Injectable({ providedIn: "root" })
export class MarketManager extends ContractsManager<Market> {
  createInstance(address: string) {
    return new Market(address, this.signer, this.zone);
  }
}
