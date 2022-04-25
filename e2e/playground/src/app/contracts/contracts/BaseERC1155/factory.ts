import { ContractFactory } from "@ethersproject/contracts";
import type { BaseERC1155 } from "./contract";
import type { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, BytesLike, BigNumberish } from "ethers";
import abi from "./abi";
import bytecode from "./bytecode";

export class BaseERC1155Factory extends ContractFactory {
  override deploy!: (_uri: string, overrides?: PayableOverrides) => Promise<BaseERC1155>;

  constructor(signer?: Signer) {
    super(abi, bytecode, signer);
  }
}
