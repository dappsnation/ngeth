import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers";
import { BaseERC721 } from "./contract";

@Injectable()
export class BaseERC721Manager extends ContractsManager<BaseERC721> {
  protected contractType = BaseERC721;
}
