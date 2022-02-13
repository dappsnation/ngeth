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

interface MarketEvents {
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
    AcceptOffer: { contractAddress: string; from: string; tokenId: BigNumberish };
    CancelOffer: { contractAddress: string; from: string; tokenId: BigNumberish };
    UpsertOffer: { contractAddress: string; from: string; tokenId: BigNumberish };
  };
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

export class Market extends TypedContract<MarketEvents> {
  constructor(signer?: Signer | Provider) {
    super(env.addresses.Market, abi, signer);
  }

  offers(
    arg: string,
    arg: string,
    arg: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumberish, BigNumberish, BytesLike]> {
    return this.functions["offers"](...arguments);
  }

  acceptOffer(
    contractAddress: string,
    from: string,
    to: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction> {
    return this.functions["acceptOffer"](...arguments);
  }
  cancelOffer(contractAddress: string, tokenId: BigNumberish, overrides?: Overrides): Promise<ContractTransaction> {
    return this.functions["cancelOffer"](...arguments);
  }
  upsertOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    price: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    return this.functions["upsertOffer"](...arguments);
  }
}
