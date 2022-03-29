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

export interface ERC165Events {
  events: never;
  filters: never;
  queries: never;
}

export interface ERC165 extends NgContract<ERC165Events> {
  supportsInterface: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
}

export function isERC165(contract: Contract): contract is ERC165 {
  return ERC165Abi.filter((def) => def.type === "function").every((def) => def.name in contract.functions);
}

export const ERC165Abi = [
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];
