import { ContractFactory, PayableOverrides } from "@ethersproject/contracts";
import type { Signer } from "@ethersproject/abstract-signer";
import type { BaseERC721 } from "./contract";
import abi from "./abi";
import bytecode from "./bytecode";

export class BaseERC721Factory extends ContractFactory {
  override deploy!: (overrides?: PayableOverrides) => Promise<BaseERC721>;

  constructor(signer?: Signer) {
    super(abi, bytecode, signer);
  }
}
