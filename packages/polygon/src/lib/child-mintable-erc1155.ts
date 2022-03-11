import { NgContract, FilterParam, TypedFilter } from "@ngeth/core";
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

export interface ChildMintableERC1155Events {
  events: {
    ApprovalForAll: (account: string, operator: string, approved: boolean) => void;
    MetaTransactionExecuted: (userAddress: string, relayerAddress: string, functionSignature: BytesLike) => void;
    RoleAdminChanged: (role: BytesLike, previousAdminRole: BytesLike, newAdminRole: BytesLike) => void;
    RoleGranted: (role: BytesLike, account: string, sender: string) => void;
    RoleRevoked: (role: BytesLike, account: string, sender: string) => void;
    TransferBatch: (operator: string, from: string, to: string, ids: BigNumberish[], values: BigNumberish[]) => void;
    TransferSingle: (operator: string, from: string, to: string, id: BigNumberish, value: BigNumberish) => void;
    URI: (value: string, id: BigNumberish) => void;
  };
  filters: {
    ApprovalForAll: (account?: FilterParam<string>, operator?: FilterParam<string>) => TypedFilter<"ApprovalForAll">;
    RoleAdminChanged: (
      role?: FilterParam<BytesLike>,
      previousAdminRole?: FilterParam<BytesLike>,
      newAdminRole?: FilterParam<BytesLike>
    ) => TypedFilter<"RoleAdminChanged">;
    RoleGranted: (
      role?: FilterParam<BytesLike>,
      account?: FilterParam<string>,
      sender?: FilterParam<string>
    ) => TypedFilter<"RoleGranted">;
    RoleRevoked: (
      role?: FilterParam<BytesLike>,
      account?: FilterParam<string>,
      sender?: FilterParam<string>
    ) => TypedFilter<"RoleRevoked">;
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
    RoleAdminChanged: { role: BytesLike; previousAdminRole: BytesLike; newAdminRole: BytesLike };
    RoleGranted: { role: BytesLike; account: string; sender: string };
    RoleRevoked: { role: BytesLike; account: string; sender: string };
    TransferBatch: { operator: string; from: string; to: string; ids: BigNumber[]; values: BigNumber[] };
    TransferSingle: { operator: string; from: string; to: string; id: BigNumber; value: BigNumber };
    URI: { value: string; id: BigNumber };
  };
}

export class ChildMintableERC1155 extends NgContract<ChildMintableERC1155Events> {
  // Read
  DEFAULT_ADMIN_ROLE!: (overrides?: CallOverrides) => Promise<BytesLike>;
  DEPOSITOR_ROLE!: (overrides?: CallOverrides) => Promise<BytesLike>;
  ERC712_VERSION!: (overrides?: CallOverrides) => Promise<string>;
  balanceOf!: (account: string, id: BigNumberish, overrides?: CallOverrides) => Promise<BigNumber>;
  balanceOfBatch!: (accounts: string[], ids: BigNumberish[], overrides?: CallOverrides) => Promise<BigNumber[]>;
  getChainId!: (overrides?: CallOverrides) => Promise<BigNumber>;
  getDomainSeperator!: (overrides?: CallOverrides) => Promise<BytesLike>;
  getNonce!: (user: string, overrides?: CallOverrides) => Promise<BigNumber>;
  getRoleAdmin!: (role: BytesLike, overrides?: CallOverrides) => Promise<BytesLike>;
  getRoleMember!: (role: BytesLike, index: BigNumberish, overrides?: CallOverrides) => Promise<string>;
  getRoleMemberCount!: (role: BytesLike, overrides?: CallOverrides) => Promise<BigNumber>;
  hasRole!: (role: BytesLike, account: string, overrides?: CallOverrides) => Promise<boolean>;
  isApprovedForAll!: (account: string, operator: string, overrides?: CallOverrides) => Promise<boolean>;
  supportsInterface!: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
  uri!: (arg: BigNumberish, overrides?: CallOverrides) => Promise<string>;

  // Write
  executeMetaTransaction!: (
    userAddress: string,
    functionSignature: BytesLike,
    sigR: BytesLike,
    sigS: BytesLike,
    sigV: BigNumberish,
    overrides?: PayableOverrides
  ) => Promise<ContractTransaction>;
  grantRole!: (role: BytesLike, account: string, overrides?: Overrides) => Promise<ContractTransaction>;
  renounceRole!: (role: BytesLike, account: string, overrides?: Overrides) => Promise<ContractTransaction>;
  revokeRole!: (role: BytesLike, account: string, overrides?: Overrides) => Promise<ContractTransaction>;
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
  deposit!: (user: string, depositData: BytesLike, overrides?: Overrides) => Promise<ContractTransaction>;
  withdrawSingle!: (id: BigNumberish, amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  withdrawBatch!: (ids: BigNumberish[], amounts: BigNumberish[], overrides?: Overrides) => Promise<ContractTransaction>;
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

  constructor(address: string, signer?: Signer | Provider) {
    super(address, abi, signer);
  }
}

export const abi = [
  {
    inputs: [
      { internalType: "string", name: "uri_", type: "string" },
      { internalType: "address", name: "childChainManager", type: "address" },
    ],
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
      { indexed: false, internalType: "address", name: "userAddress", type: "address" },
      { indexed: false, internalType: "address payable", name: "relayerAddress", type: "address" },
      { indexed: false, internalType: "bytes", name: "functionSignature", type: "bytes" },
    ],
    name: "MetaTransactionExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      { indexed: true, internalType: "bytes32", name: "previousAdminRole", type: "bytes32" },
      { indexed: true, internalType: "bytes32", name: "newAdminRole", type: "bytes32" },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      { indexed: true, internalType: "address", name: "account", type: "address" },
      { indexed: true, internalType: "address", name: "sender", type: "address" },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      { indexed: true, internalType: "address", name: "account", type: "address" },
      { indexed: true, internalType: "address", name: "sender", type: "address" },
    ],
    name: "RoleRevoked",
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
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEPOSITOR_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC712_VERSION",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
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
      { internalType: "address", name: "userAddress", type: "address" },
      { internalType: "bytes", name: "functionSignature", type: "bytes" },
      { internalType: "bytes32", name: "sigR", type: "bytes32" },
      { internalType: "bytes32", name: "sigS", type: "bytes32" },
      { internalType: "uint8", name: "sigV", type: "uint8" },
    ],
    name: "executeMetaTransaction",
    outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getDomainSeperator",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getNonce",
    outputs: [{ internalType: "uint256", name: "nonce", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "getRoleMember",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleMemberCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
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
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
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
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "uri",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "bytes", name: "depositData", type: "bytes" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "withdrawSingle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    name: "withdrawBatch",
    outputs: [],
    stateMutability: "nonpayable",
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
];
