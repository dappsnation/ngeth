import { FilterParam, TypedFilter } from "@ngeth/ethers-core";
import { NgContract } from "@ngeth/ethers-angular";
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

export interface IERC721ReceiverEvents {
  events: never;
  filters: never;
  queries: never;
}

export interface IERC721Receiver extends NgContract<IERC721ReceiverEvents> {
  onERC721Received: (
    operator: string,
    from: string,
    tokenId: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
}

export function isIERC721Receiver(contract: Contract): contract is IERC721Receiver {
  return IERC721ReceiverAbi.filter((def) => def.type === "function").every(
    (def) => def.name && def.name in contract.functions
  );
}

export const IERC721ReceiverAbi = [
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "address", name: "from", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "onERC721Received",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
