import { FilterParam, TypedFilter } from "@ngeth/ethers-core";
import { NgContract } from "@ngeth/ethers";
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

export interface OwnableEvents {
  events: { OwnershipTransferred: (previousOwner: string, newOwner: string) => void };
  filters: {
    OwnershipTransferred: (
      previousOwner?: FilterParam<string>,
      newOwner?: FilterParam<string>
    ) => TypedFilter<"OwnershipTransferred">;
  };
  queries: { OwnershipTransferred: { previousOwner: string; newOwner: string } };
}

export interface Ownable extends NgContract<OwnableEvents> {
  owner: (overrides?: CallOverrides) => Promise<string>;
  renounceOwnership: (overrides?: Overrides) => Promise<ContractTransaction>;
  transferOwnership: (newOwner: string, overrides?: Overrides) => Promise<ContractTransaction>;
}

export function isOwnable(contract: Contract): contract is Ownable {
  return OwnableAbi.filter((def) => def.type === "function").every((def) => def.name && def.name in contract.functions);
}

export const OwnableAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
