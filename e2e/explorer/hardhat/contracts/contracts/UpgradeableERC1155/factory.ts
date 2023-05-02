import { ContractFactory } from "@ethersproject/contracts";
import type { UpgradeableERC1155 } from "./contract";
import type { Signer, PayableOverrides } from "ethers";
import abi from "./abi";
import bytecode from "./bytecode";

export class UpgradeableERC1155Factory extends ContractFactory {
  override deploy!: (overrides?: PayableOverrides) => Promise<UpgradeableERC1155>;

  constructor(signer?: Signer) {
    super(abi, bytecode, signer);
  }
}
