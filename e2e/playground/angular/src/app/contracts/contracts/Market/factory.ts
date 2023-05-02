import { ContractFactory } from "@ethersproject/contracts";
import type { Market } from "./contract";
import type { Signer, PayableOverrides } from "ethers";
import abi from "./abi";
import bytecode from "./bytecode";

export class MarketFactory extends ContractFactory {
  override deploy!: (overrides?: PayableOverrides) => Promise<Market>;

  constructor(signer?: Signer) {
    super(abi, bytecode, signer);
  }
}
