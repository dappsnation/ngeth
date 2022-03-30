import { ContractFactory, PayableOverrides } from "@ethersproject/contracts";
import type { Signer } from "@ethersproject/abstract-signer";
import type { OpenseaERC1155 } from "./contract";
import abi from "./abi";
import bytecode from "./bytecode";

export class OpenseaERC1155Factory extends ContractFactory {
  override deploy!: (_contractURI: string, _tokenURI: string, overrides?: PayableOverrides) => Promise<OpenseaERC1155>;

  constructor(signer?: Signer) {
    super(abi, bytecode, signer);
  }
}
