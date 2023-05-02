import { ContractFactory } from "@ethersproject/contracts";
import type { ERC1155Factory } from "./contract";
import type { Signer, PayableOverrides } from "ethers";
import abi from "./abi";
import bytecode from "./bytecode";

export class ERC1155FactoryFactory extends ContractFactory {
  /**
   */
  override deploy!: (overrides?: PayableOverrides) => Promise<ERC1155Factory>;

  constructor(signer?: Signer) {
    super(abi, bytecode, signer);
  }
}
