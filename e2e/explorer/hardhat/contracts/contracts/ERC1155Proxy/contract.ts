import { EthersContract } from "@ngeth/ethers-core";
import type { FilterParam, TypedFilter } from "@ngeth/ethers-core";
import type { Signer, ContractTransaction, Overrides } from "ethers";
import type { Provider } from "@ethersproject/providers";
import abi from "./abi";

export interface ERC1155ProxyEvents {
  events: {
    /**
     * Emit when the bae contrat has been cloned
     * @param clone address of the cloned contract
     * @param from account which cloned the contract
     */
    Clone: (from: string, clone: string) => void;
  };
  filters: {
    /**
     * Emit when the bae contrat has been cloned
     * @param clone address of the cloned contract
     * @param from account which cloned the contract
     */
    Clone: (from?: FilterParam<string>, clone?: FilterParam<string>) => TypedFilter<"Clone">;
  };
  queries: {
    /** Emit when the bae contrat has been cloned */
    Clone: {
      /** account which cloned the contract */
      from: string;
      /** address of the cloned contract */
      clone: string;
    };
  };
}

export class ERC1155Proxy extends EthersContract<ERC1155ProxyEvents> {
  // Read

  // Write
  create!: (_tokenURI: string, overrides?: Overrides) => Promise<ContractTransaction>;

  constructor(address: string, signer?: Signer | Provider) {
    super(address, abi, signer);
  }
}
