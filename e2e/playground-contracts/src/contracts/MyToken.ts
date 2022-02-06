import { TypedContract, FilterParam, TypedFilter } from "./common";
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
import env from "../../environments/environment";

interface MyTokenEvents {
  events: {
    Approval: (owner: string, approved: string, tokenId: BigNumberish) => void;
    ApprovalForAll: (owner: string, operator: string, approved: boolean) => void;
    OwnershipTransferred: (previousOwner: string, newOwner: string) => void;
    Transfer: (from: string, to: string, tokenId: BigNumberish) => void;
  };
  filters: {
    Approval: (
      owner?: FilterParam<string>,
      approved?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"Approval">;
    ApprovalForAll: (owner?: FilterParam<string>, operator?: FilterParam<string>) => TypedFilter<"ApprovalForAll">;
    OwnershipTransferred: (
      previousOwner?: FilterParam<string>,
      newOwner?: FilterParam<string>
    ) => TypedFilter<"OwnershipTransferred">;
    Transfer: (
      from?: FilterParam<string>,
      to?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"Transfer">;
  };
  queries: {
    Approval: { owner: string; approved: string; tokenId: BigNumberish };
    ApprovalForAll: { owner: string; operator: string };
    OwnershipTransferred: { previousOwner: string; newOwner: string };
    Transfer: { from: string; to: string; tokenId: BigNumberish };
  };
}

export const abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
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
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
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
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
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
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "string", name: "uri", type: "string" },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
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
      { internalType: "bytes", name: "_data", type: "bytes" },
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
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class MyToken extends TypedContract<MyTokenEvents> {
  constructor(signer?: Signer | Provider) {
    super(env.addresses.MyToken, abi, signer);
  }

  balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumberish> {
    return this.functions["balanceOf"](...arguments);
  }
  getApproved(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string> {
    return this.functions["getApproved"](...arguments);
  }
  isApprovedForAll(owner: string, operator: string, overrides?: CallOverrides): Promise<boolean> {
    return this.functions["isApprovedForAll"](...arguments);
  }
  name(overrides?: CallOverrides): Promise<string> {
    return this.functions["name"](...arguments);
  }
  owner(overrides?: CallOverrides): Promise<string> {
    return this.functions["owner"](...arguments);
  }
  ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string> {
    return this.functions["ownerOf"](...arguments);
  }
  supportsInterface(interfaceId: BytesLike, overrides?: CallOverrides): Promise<boolean> {
    return this.functions["supportsInterface"](...arguments);
  }
  symbol(overrides?: CallOverrides): Promise<string> {
    return this.functions["symbol"](...arguments);
  }
  tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string> {
    return this.functions["tokenURI"](...arguments);
  }

  approve(to: string, tokenId: BigNumberish, overrides?: Overrides): Promise<ContractTransaction> {
    return this.functions["approve"](...arguments);
  }
  renounceOwnership(overrides?: Overrides): Promise<ContractTransaction> {
    return this.functions["renounceOwnership"](...arguments);
  }
  safeMint(to: string, tokenId: BigNumberish, uri: string, overrides?: Overrides): Promise<ContractTransaction> {
    return this.functions["safeMint"](...arguments);
  }
  ["safeTransferFrom(address,address,uint256)"](
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    return this.functions["safeTransferFrom(address,address,uint256)"](...arguments);
  }
  ["safeTransferFrom(address,address,uint256,bytes)"](
    from: string,
    to: string,
    tokenId: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    return this.functions["safeTransferFrom(address,address,uint256,bytes)"](...arguments);
  }
  setApprovalForAll(operator: string, approved: boolean, overrides?: Overrides): Promise<ContractTransaction> {
    return this.functions["setApprovalForAll"](...arguments);
  }
  transferFrom(from: string, to: string, tokenId: BigNumberish, overrides?: Overrides): Promise<ContractTransaction> {
    return this.functions["transferFrom"](...arguments);
  }
  transferOwnership(newOwner: string, overrides?: Overrides): Promise<ContractTransaction> {
    return this.functions["transferOwnership"](...arguments);
  }
}
