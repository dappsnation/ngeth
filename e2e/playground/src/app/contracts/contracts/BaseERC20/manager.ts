import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers";
import { BaseERC20 } from "./contract";

@Injectable({ providedIn: "root" })
export class BaseERC20Manager extends ContractsManager<BaseERC20> {
  protected contractType = BaseERC20;
}
