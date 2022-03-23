import { NgContract, FilterParam, TypedFilter } from "@ngeth/ethers";
import {
  BigNumber,
  Overrides,
  CallOverrides,
  Signer,
  ContractTransaction,
  BytesLike,
  BigNumberish,
  constants,
} from "ethers";
import { Provider } from "@ethersproject/providers";
import { NgZone } from "@angular/core";
import { combineLatest } from "rxjs";
import { map } from 'rxjs/operators';
import { erc721Tokens } from "./utils";

export interface BaseERC721Events {
  events: {
    Approval: (owner: string, approved: string, tokenId: BigNumberish) => void;
    ApprovalForAll: (owner: string, operator: string, approved: boolean) => void;
    Transfer: (from: string, to: string, tokenId: BigNumberish) => void;
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

export class ERC721 extends NgContract<BaseERC721Events> {
  // Read
  balanceOf!: (owner: string, overrides?: CallOverrides) => Promise<BigNumber>;
  getApproved!: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;
  isApprovedForAll!: (owner: string, operator: string, overrides?: CallOverrides) => Promise<boolean>;
  name!: (overrides?: CallOverrides) => Promise<string>;
  ownerOf!: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;
  supportsInterface!: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
  symbol!: (overrides?: CallOverrides) => Promise<string>;
  tokenURI!: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;

  // Write
  approve!: (to: string, tokenId: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  setApprovalForAll!: (operator: string, approved: boolean, overrides?: Overrides) => Promise<ContractTransaction>;
  transferFrom!: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;

  allTokens$ = this.from(this.filters.Transfer(constants.AddressZero)).pipe(
    map(events => events.map(event => event.args[2].toString()))
  );

  constructor(address: string, signer: Signer | Provider, zone: NgZone) {
    super(address, ERC721_abi, signer, zone);
  }

  exist() {
    return this.name()
      .then(() => true)
      .catch(() => false);
  }

  tokensChanges(address: string) {
    const received = this.filters.Transfer(null, address);
    const sent = this.filters.Transfer(address);
    return combineLatest([
      this.from(received),
      this.from(sent),
    ]).pipe(
      map(([received, sent]) => erc721Tokens(received, sent))
    );
  }


  safeTransferFrom(from: string, to: string, tokenId: BigNumberish, data?:BytesLike | Overrides, overrides?: Overrides) {
    if (data && (data as BytesLike).length) {
      return this.functions['safeTransferFrom(address,address,uint256,bytes)'](from, to, tokenId, data, overrides);
    } else {
      return this.functions['safeTransferFrom(address,address,uint256)'](from, to, tokenId, data);
    }
  }
}

export const ERC721_abi = [
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
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
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
];
