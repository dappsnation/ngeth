import { ContractFactory } from "@ethersproject/contracts";
import type { BaseERC20 } from "./contract";
import type { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, BytesLike, BigNumberish } from "ethers";
import abi from "./abi";
import bytecode from "./bytecode";

export class BaseERC20Factory extends ContractFactory {
  /**
   */
  override deploy!: (_name: string, overrides?: PayableOverrides) => Promise<BaseERC20>;

  constructor(signer?: Signer) {
    super(abi, bytecode, signer);
  }
}
