import { EthersContract, FilterParam, TypedFilter } from "@ngeth/ethers-core";
import type {
  Contract,
  BigNumber,
  Overrides,
  CallOverrides,
  PayableOverrides,
  Signer,
  ContractTransaction,
  BytesLike,
  BigNumberish,
} from "ethers";

export interface IERC165UpgradeableEvents {
  events: never;
  filters: never;
  queries: never;
}

/**
 * Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 * For an implementation, see {ERC165}.
 */
export interface IERC165Upgradeable extends EthersContract<IERC165UpgradeableEvents> {
  /**
   * Returns true if this contract implements the interface defined by
   * `interfaceId`. See the corresponding
   * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
   * to learn more about how these ids are created.
   * This function call must use less than 30 000 gas.
   */
  supportsInterface: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
}

export const IERC165UpgradeableAbi = [
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];
