import { NgContract, FilterParam, TypedFilter } from "@ngeth/ethers";
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

export interface IERC165Events {
  events: never;
  filters: never;
  queries: never;
}

export interface IERC165 extends NgContract<IERC165Events> {
  supportsInterface: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
}

export function isIERC165(contract: Contract): contract is IERC165 {
  return IERC165Abi.filter((def) => def.type === "function").every((def) => def.name in contract.functions);
}

export const IERC165Abi = [
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];
