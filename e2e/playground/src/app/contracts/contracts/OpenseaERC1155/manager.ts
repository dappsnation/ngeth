import { Injectable } from "@angular/core";
import { ContractsManager } from "@ngeth/ethers";
import { OpenseaERC1155 } from "./contract";

@Injectable()
export class OpenseaERC1155Manager extends ContractsManager<OpenseaERC1155> {
  protected contractType = OpenseaERC1155;
}
