import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers";
import { Market } from "./contract";

@Injectable({ providedIn: "root" })
export class MarketManager extends ContractsManager<Market> {
  protected contractType = Market;
}
