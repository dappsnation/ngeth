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

export interface MarketEvents {
  events: {
    AcceptOffer: (
      contractAddress: string,
      from: string,
      tokenId: BigNumberish,
      to: string,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike
    ) => void;
    CancelOffer: (contractAddress: string, from: string, tokenId: BigNumberish) => void;
    UpsertOffer: (
      contractAddress: string,
      from: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike
    ) => void;
  };
  filters: {
    AcceptOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"AcceptOffer">;
    CancelOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"CancelOffer">;
    UpsertOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"UpsertOffer">;
  };
  queries: {
    AcceptOffer: {
      contractAddress: string;
      from: string;
      tokenId: BigNumber;
      to: string;
      amount: BigNumber;
      price: BigNumber;
      data: BytesLike;
    };
    CancelOffer: { contractAddress: string; from: string; tokenId: BigNumber };
    UpsertOffer: {
      contractAddress: string;
      from: string;
      tokenId: BigNumber;
      amount: BigNumber;
      price: BigNumber;
      data: BytesLike;
    };
  };
}

export class Market extends NgContract<MarketEvents> {
  // Read
  offers!: (
    arg: string,
    arg: string,
    arg: BigNumberish,
    overrides?: CallOverrides
  ) => Promise<[BigNumber, BigNumber, BytesLike]>;

  // Write
  acceptOffer!: (
    contractAddress: string,
    from: string,
    to: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    overrides?: PayableOverrides
  ) => Promise<ContractTransaction>;
  cancelOffer!: (contractAddress: string, tokenId: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  upsertOffer!: (
    contractAddress: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    price: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;

  constructor(address: string, signer?: Signer | Provider) {
    super(address, abi, signer);
  }
}

export const abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "AcceptOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "CancelOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "UpsertOffer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "address payable", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "acceptOffer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "cancelOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "offers",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "upsertOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
