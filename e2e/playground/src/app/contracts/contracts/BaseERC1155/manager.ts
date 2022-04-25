import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers";
import { BaseERC1155 } from "./contract";

@Injectable()
export class BaseERC1155Manager extends ContractsManager<BaseERC1155> {
  protected contractType = BaseERC1155;
}
