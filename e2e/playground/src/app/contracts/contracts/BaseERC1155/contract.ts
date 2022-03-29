import { NgContract, FilterParam, TypedFilter } from "@ngeth/ethers";
import {
  BigNumber,
  Overrides,
  CallOverrides,
  PayableOverrides,
  Signer,
  ContractTransaction,
  BytesLike,
  BigNumberish,
} from "ethers";
import { Provider } from "@ethersproject/providers";
import abi from "./abi";

export interface BaseERC1155Events {
  events: {
    ApprovalForAll: (account: string, operator: string, approved: boolean) => void;
    OwnershipTransferred: (previousOwner: string, newOwner: string) => void;
    TransferBatch: (operator: string, from: string, to: string, ids: BigNumber[], values: BigNumber[]) => void;
    TransferSingle: (operator: string, from: string, to: string, id: BigNumber, value: BigNumber) => void;
    URI: (value: string, id: BigNumber) => void;
  };
  filters: {
    ApprovalForAll: (account?: FilterParam<string>, operator?: FilterParam<string>) => TypedFilter<"ApprovalForAll">;
    OwnershipTransferred: (
      previousOwner?: FilterParam<string>,
      newOwner?: FilterParam<string>
    ) => TypedFilter<"OwnershipTransferred">;
    TransferBatch: (
      operator?: FilterParam<string>,
      from?: FilterParam<string>,
      to?: FilterParam<string>
    ) => TypedFilter<"TransferBatch">;
    TransferSingle: (
      operator?: FilterParam<string>,
      from?: FilterParam<string>,
      to?: FilterParam<string>
    ) => TypedFilter<"TransferSingle">;
    URI: (id?: FilterParam<BigNumberish>) => TypedFilter<"URI">;
  };
  queries: {
    ApprovalForAll: { account: string; operator: string; approved: boolean };
    OwnershipTransferred: { previousOwner: string; newOwner: string };
    TransferBatch: { operator: string; from: string; to: string; ids: BigNumber[]; values: BigNumber[] };
    TransferSingle: { operator: string; from: string; to: string; id: BigNumber; value: BigNumber };
    URI: { value: string; id: BigNumber };
  };
}

export class BaseERC1155 extends NgContract<BaseERC1155Events> {
  // Read
  balanceOf!: (account: string, id: BigNumberish, overrides?: CallOverrides) => Promise<BigNumber>;
  balanceOfBatch!: (accounts: string[], ids: BigNumberish[], overrides?: CallOverrides) => Promise<BigNumber[]>;
  isApprovedForAll!: (account: string, operator: string, overrides?: CallOverrides) => Promise<boolean>;
  owner!: (overrides?: CallOverrides) => Promise<string>;
  supportsInterface!: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
  uri!: (arg: BigNumberish, overrides?: CallOverrides) => Promise<string>;

  // Write
  mint!: (
    account: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  mintBatch!: (
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  renounceOwnership!: (overrides?: Overrides) => Promise<ContractTransaction>;
  safeBatchTransferFrom!: (
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  safeTransferFrom!: (
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  setApprovalForAll!: (operator: string, approved: boolean, overrides?: Overrides) => Promise<ContractTransaction>;
  setURI!: (newuri: string, overrides?: Overrides) => Promise<ContractTransaction>;
  transferOwnership!: (newOwner: string, overrides?: Overrides) => Promise<ContractTransaction>;

  constructor(address: string, signer?: Signer | Provider) {
    super(address, abi, signer);
  }
}

export const BaseERC1155_abi = [
  {
    inputs: [{ internalType: "string", name: "_uri", type: "string" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "account", type: "address" },
      { indexed: true, internalType: "address", name: "operator", type: "address" },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
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
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "operator", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { indexed: false, internalType: "uint256[]", name: "values", type: "uint256[]" },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "operator", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "value", type: "string" },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "accounts", type: "address[]" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    ],
    name: "balanceOfBatch",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "mintBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
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
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "newuri", type: "string" }],
    name: "setURI",
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
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "uri",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];
