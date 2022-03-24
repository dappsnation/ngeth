import { ContractFactory, PayableOverrides } from "@ethersproject/contracts";
import type { Signer } from "@ethersproject/abstract-signer";
import type { BaseERC20 } from "./contract";
import abi from "./abi";
import bytecode from "./bytecode";

export class BaseERC20Factory extends ContractFactory {
  override deploy!: (overrides?: PayableOverrides) => Promise<BaseERC20>;

  constructor(signer?: Signer) {
    super(abi, bytecode, signer);
  }
}
