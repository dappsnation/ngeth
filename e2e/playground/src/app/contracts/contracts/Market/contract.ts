import { NgZone } from "@angular/core";
import { FilterParam, TypedFilter } from "@ngeth/ethers-core";
import { NgContract } from "@ngeth/ethers-angular";
import type {
  BigNumber,
  Overrides,
  CallOverrides,
  PayableOverrides,
  Signer,
  ContractTransaction,
  BytesLike,
  BigNumberish,
} from "ethers";
import type { Provider } from "@ethersproject/providers";
import abi from "./abi";

export interface MarketEvents {
  events: {
    AcceptOffer: (
      contractAddress: string,
      from: string,
      tokenId: BigNumber,
      to: string,
      amount: BigNumber,
      price: BigNumber,
      data: BytesLike
    ) => void;
    CancelOffer: (contractAddress: string, from: string, tokenId: BigNumber) => void;
    UpsertOffer: (
      contractAddress: string,
      from: string,
      tokenId: BigNumber,
      amount: BigNumber,
      price: BigNumber,
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
    arg1: string,
    arg2: BigNumberish,
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

  constructor(address: string, signer?: Signer | Provider, zone?: NgZone) {
    super(address, abi, signer, zone);
  }
}
