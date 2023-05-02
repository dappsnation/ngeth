import { EthersContract } from "@ngeth/ethers-core";
import type { FilterParam, TypedFilter } from "@ngeth/ethers-core";
import type { Signer, ContractTransaction, Overrides } from "ethers";
import type { Provider } from "@ethersproject/providers";
import abi from "./abi";

export interface ERC1155FactoryEvents {
  events: { Clone: (from: string, clone: string) => void };
  filters: { Clone: (from?: FilterParam<string>, clone?: FilterParam<string>) => TypedFilter<"Clone"> };
  queries: {
    Clone: {
      from: string;
      clone: string;
    };
  };
}

export class ERC1155Factory extends EthersContract<ERC1155FactoryEvents> {
  // Read

  // Write
  create!: (_contractURI: string, _tokenURI: string, overrides?: Overrides) => Promise<ContractTransaction>;

  constructor(address: string, signer?: Signer | Provider) {
    super(address, abi, signer);
  }
}
