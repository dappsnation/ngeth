import { ContractFactory } from "@ethersproject/contracts";
import type { ERC1155Proxy } from "./contract";
import type { Signer, PayableOverrides } from "ethers";
import abi from "./abi";
import bytecode from "./bytecode";

export class ERC1155ProxyFactory extends ContractFactory {
  /**
   */
  override deploy!: (overrides?: PayableOverrides) => Promise<ERC1155Proxy>;

  constructor(signer?: Signer) {
    super(abi, bytecode, signer);
  }
}
