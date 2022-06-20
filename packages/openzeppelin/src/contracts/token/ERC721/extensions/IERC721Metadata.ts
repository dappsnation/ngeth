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

export interface IERC721MetadataEvents {
  events: {
    Approval: (owner: string, approved: string, tokenId: BigNumber) => void;
    ApprovalForAll: (owner: string, operator: string, approved: boolean) => void;
    Transfer: (from: string, to: string, tokenId: BigNumber) => void;
  };
  filters: {
    Approval: (
      owner?: FilterParam<string>,
      approved?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"Approval">;
    ApprovalForAll: (owner?: FilterParam<string>, operator?: FilterParam<string>) => TypedFilter<"ApprovalForAll">;
    Transfer: (
      from?: FilterParam<string>,
      to?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"Transfer">;
  };
  queries: {
    Approval: { owner: string; approved: string; tokenId: BigNumber };
    ApprovalForAll: { owner: string; operator: string; approved: boolean };
    Transfer: { from: string; to: string; tokenId: BigNumber };
  };
}

export interface IERC721Metadata extends NgContract<IERC721MetadataEvents> {
  balanceOf: (owner: string, overrides?: CallOverrides) => Promise<BigNumber>;
  getApproved: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;
  isApprovedForAll: (owner: string, operator: string, overrides?: CallOverrides) => Promise<boolean>;
  name: (overrides?: CallOverrides) => Promise<string>;
  ownerOf: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;
  supportsInterface: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
  symbol: (overrides?: CallOverrides) => Promise<string>;
  tokenURI: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;
  approve: (to: string, tokenId: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  ["safeTransferFrom(address,address,uint256)"]: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  ["safeTransferFrom(address,address,uint256,bytes)"]: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  setApprovalForAll: (operator: string, _approved: boolean, overrides?: Overrides) => Promise<ContractTransaction>;
  transferFrom: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
}

export function isIERC721Metadata(contract: Contract): contract is IERC721Metadata {
  return IERC721MetadataAbi.filter((def) => def.type === "function").every(
    (def) => def.name && def.name in contract.functions
  );
}

export const IERC721MetadataAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "approved", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "operator", type: "address" },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "operator", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "owner", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "_approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
