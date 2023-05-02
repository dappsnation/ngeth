import { EthersContract } from "@ngeth/ethers-core";
import type { FilterParam, TypedFilter } from "@ngeth/ethers-core";
import type { CallOverrides, BytesLike } from "ethers";

export interface ERC165UpgradeableEvents {
  events: never;
  filters: never;
  queries: never;
}

/**
 * Implementation of the {IERC165} interface. Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check for the additional interface id that will be supported. For example: ```solidity function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId); } ``` Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.
 */
export interface ERC165Upgradeable extends EthersContract<ERC165UpgradeableEvents> {
  /**
   * See {IERC165-supportsInterface}.
   */
  supportsInterface: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
}

export const ERC165UpgradeableAbi = [
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];
