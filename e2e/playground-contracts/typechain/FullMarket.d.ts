/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface FullMarketInterface extends ethers.utils.Interface {
  functions: {
    "erc1155AcceptOffer(address,address,address,uint256,uint256)": FunctionFragment;
    "erc1155CancelOffer(address,uint256)": FunctionFragment;
    "erc1155Offers(address,address,uint256)": FunctionFragment;
    "erc1155UpsertOffer(address,uint256,uint256,uint256,bytes)": FunctionFragment;
    "erc721AcceptOffer(address,uint256,address)": FunctionFragment;
    "erc721CancelOffer(address,uint256)": FunctionFragment;
    "erc721CreateOffer(address,uint256,uint256)": FunctionFragment;
    "erc721Offers(address,uint256)": FunctionFragment;
    "erc777AcceptOffer(address,address,address,uint256)": FunctionFragment;
    "erc777CancelOffer(address)": FunctionFragment;
    "erc777Offers(address,address)": FunctionFragment;
    "erc777UpsertOffer(address,uint256,uint256,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "erc1155AcceptOffer",
    values: [string, string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "erc1155CancelOffer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "erc1155Offers",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "erc1155UpsertOffer",
    values: [string, BigNumberish, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "erc721AcceptOffer",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "erc721CancelOffer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "erc721CreateOffer",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "erc721Offers",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "erc777AcceptOffer",
    values: [string, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "erc777CancelOffer",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "erc777Offers",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "erc777UpsertOffer",
    values: [string, BigNumberish, BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "erc1155AcceptOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc1155CancelOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc1155Offers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc1155UpsertOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc721AcceptOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc721CancelOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc721CreateOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc721Offers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc777AcceptOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc777CancelOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc777Offers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "erc777UpsertOffer",
    data: BytesLike
  ): Result;

  events: {
    "ERC1155AcceptOffer(address,address,uint256,address,uint256,uint256,bytes)": EventFragment;
    "ERC1155CancelOffer(address,address,uint256)": EventFragment;
    "ERC1155UpsertOffer(address,address,uint256,uint256,uint256,bytes)": EventFragment;
    "ERC721AcceptOffer(address,address,uint256,address,uint256)": EventFragment;
    "ERC721CancelOffer(address,address,uint256)": EventFragment;
    "ERC721CreateOffer(address,address,uint256,uint256)": EventFragment;
    "ERC777AcceptOffer(address,address,address,uint256,uint256,bytes)": EventFragment;
    "ERC777CancelOffer(address,address)": EventFragment;
    "ERC777UpsertOffer(address,address,uint256,uint256,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ERC1155AcceptOffer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ERC1155CancelOffer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ERC1155UpsertOffer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ERC721AcceptOffer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ERC721CancelOffer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ERC721CreateOffer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ERC777AcceptOffer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ERC777CancelOffer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ERC777UpsertOffer"): EventFragment;
}

export type ERC1155AcceptOfferEvent = TypedEvent<
  [string, string, BigNumber, string, BigNumber, BigNumber, string] & {
    contractAddress: string;
    from: string;
    tokenId: BigNumber;
    to: string;
    amount: BigNumber;
    price: BigNumber;
    data: string;
  }
>;

export type ERC1155CancelOfferEvent = TypedEvent<
  [string, string, BigNumber] & {
    contractAddress: string;
    from: string;
    tokenId: BigNumber;
  }
>;

export type ERC1155UpsertOfferEvent = TypedEvent<
  [string, string, BigNumber, BigNumber, BigNumber, string] & {
    contractAddress: string;
    from: string;
    tokenId: BigNumber;
    amount: BigNumber;
    price: BigNumber;
    data: string;
  }
>;

export type ERC721AcceptOfferEvent = TypedEvent<
  [string, string, BigNumber, string, BigNumber] & {
    contractAddress: string;
    from: string;
    tokenId: BigNumber;
    to: string;
    price: BigNumber;
  }
>;

export type ERC721CancelOfferEvent = TypedEvent<
  [string, string, BigNumber] & {
    contractAddress: string;
    from: string;
    tokenId: BigNumber;
  }
>;

export type ERC721CreateOfferEvent = TypedEvent<
  [string, string, BigNumber, BigNumber] & {
    contractAddress: string;
    from: string;
    tokenId: BigNumber;
    price: BigNumber;
  }
>;

export type ERC777AcceptOfferEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber, string] & {
    contractAddress: string;
    from: string;
    to: string;
    amount: BigNumber;
    price: BigNumber;
    data: string;
  }
>;

export type ERC777CancelOfferEvent = TypedEvent<
  [string, string] & { contractAddress: string; from: string }
>;

export type ERC777UpsertOfferEvent = TypedEvent<
  [string, string, BigNumber, BigNumber, string] & {
    contractAddress: string;
    from: string;
    amount: BigNumber;
    price: BigNumber;
    data: string;
  }
>;

export class FullMarket extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: FullMarketInterface;

  functions: {
    erc1155AcceptOffer(
      contractAddress: string,
      from: string,
      to: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    erc1155CancelOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    erc1155Offers(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string] & {
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    erc1155UpsertOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    erc721AcceptOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    erc721CancelOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    erc721CreateOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    erc721Offers(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    erc777AcceptOffer(
      contractAddress: string,
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    erc777CancelOffer(
      contractAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    erc777Offers(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string] & {
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    erc777UpsertOffer(
      contractAddress: string,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  erc1155AcceptOffer(
    contractAddress: string,
    from: string,
    to: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  erc1155CancelOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  erc1155Offers(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, string] & {
      amount: BigNumber;
      price: BigNumber;
      data: string;
    }
  >;

  erc1155UpsertOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    price: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  erc721AcceptOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    to: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  erc721CancelOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  erc721CreateOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    price: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  erc721Offers(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  erc777AcceptOffer(
    contractAddress: string,
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  erc777CancelOffer(
    contractAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  erc777Offers(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, string] & {
      amount: BigNumber;
      price: BigNumber;
      data: string;
    }
  >;

  erc777UpsertOffer(
    contractAddress: string,
    amount: BigNumberish,
    price: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    erc1155AcceptOffer(
      contractAddress: string,
      from: string,
      to: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    erc1155CancelOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    erc1155Offers(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string] & {
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    erc1155UpsertOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    erc721AcceptOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      to: string,
      overrides?: CallOverrides
    ): Promise<void>;

    erc721CancelOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    erc721CreateOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      price: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    erc721Offers(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    erc777AcceptOffer(
      contractAddress: string,
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    erc777CancelOffer(
      contractAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    erc777Offers(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, string] & {
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    erc777UpsertOffer(
      contractAddress: string,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ERC1155AcceptOffer(address,address,uint256,address,uint256,uint256,bytes)"(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null,
      to?: null,
      amount?: null,
      price?: null,
      data?: null
    ): TypedEventFilter<
      [string, string, BigNumber, string, BigNumber, BigNumber, string],
      {
        contractAddress: string;
        from: string;
        tokenId: BigNumber;
        to: string;
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    ERC1155AcceptOffer(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null,
      to?: null,
      amount?: null,
      price?: null,
      data?: null
    ): TypedEventFilter<
      [string, string, BigNumber, string, BigNumber, BigNumber, string],
      {
        contractAddress: string;
        from: string;
        tokenId: BigNumber;
        to: string;
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    "ERC1155CancelOffer(address,address,uint256)"(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { contractAddress: string; from: string; tokenId: BigNumber }
    >;

    ERC1155CancelOffer(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { contractAddress: string; from: string; tokenId: BigNumber }
    >;

    "ERC1155UpsertOffer(address,address,uint256,uint256,uint256,bytes)"(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null,
      amount?: null,
      price?: null,
      data?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber, BigNumber, string],
      {
        contractAddress: string;
        from: string;
        tokenId: BigNumber;
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    ERC1155UpsertOffer(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null,
      amount?: null,
      price?: null,
      data?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber, BigNumber, string],
      {
        contractAddress: string;
        from: string;
        tokenId: BigNumber;
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    "ERC721AcceptOffer(address,address,uint256,address,uint256)"(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null,
      to?: null,
      price?: null
    ): TypedEventFilter<
      [string, string, BigNumber, string, BigNumber],
      {
        contractAddress: string;
        from: string;
        tokenId: BigNumber;
        to: string;
        price: BigNumber;
      }
    >;

    ERC721AcceptOffer(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null,
      to?: null,
      price?: null
    ): TypedEventFilter<
      [string, string, BigNumber, string, BigNumber],
      {
        contractAddress: string;
        from: string;
        tokenId: BigNumber;
        to: string;
        price: BigNumber;
      }
    >;

    "ERC721CancelOffer(address,address,uint256)"(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { contractAddress: string; from: string; tokenId: BigNumber }
    >;

    ERC721CancelOffer(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { contractAddress: string; from: string; tokenId: BigNumber }
    >;

    "ERC721CreateOffer(address,address,uint256,uint256)"(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null,
      price?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber],
      {
        contractAddress: string;
        from: string;
        tokenId: BigNumber;
        price: BigNumber;
      }
    >;

    ERC721CreateOffer(
      contractAddress?: string | null,
      from?: string | null,
      tokenId?: BigNumberish | null,
      price?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber],
      {
        contractAddress: string;
        from: string;
        tokenId: BigNumber;
        price: BigNumber;
      }
    >;

    "ERC777AcceptOffer(address,address,address,uint256,uint256,bytes)"(
      contractAddress?: string | null,
      from?: string | null,
      to?: string | null,
      amount?: null,
      price?: null,
      data?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, BigNumber, string],
      {
        contractAddress: string;
        from: string;
        to: string;
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    ERC777AcceptOffer(
      contractAddress?: string | null,
      from?: string | null,
      to?: string | null,
      amount?: null,
      price?: null,
      data?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, BigNumber, string],
      {
        contractAddress: string;
        from: string;
        to: string;
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    "ERC777CancelOffer(address,address)"(
      contractAddress?: string | null,
      from?: string | null
    ): TypedEventFilter<
      [string, string],
      { contractAddress: string; from: string }
    >;

    ERC777CancelOffer(
      contractAddress?: string | null,
      from?: string | null
    ): TypedEventFilter<
      [string, string],
      { contractAddress: string; from: string }
    >;

    "ERC777UpsertOffer(address,address,uint256,uint256,bytes)"(
      contractAddress?: string | null,
      from?: string | null,
      amount?: null,
      price?: null,
      data?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber, string],
      {
        contractAddress: string;
        from: string;
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;

    ERC777UpsertOffer(
      contractAddress?: string | null,
      from?: string | null,
      amount?: null,
      price?: null,
      data?: null
    ): TypedEventFilter<
      [string, string, BigNumber, BigNumber, string],
      {
        contractAddress: string;
        from: string;
        amount: BigNumber;
        price: BigNumber;
        data: string;
      }
    >;
  };

  estimateGas: {
    erc1155AcceptOffer(
      contractAddress: string,
      from: string,
      to: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    erc1155CancelOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    erc1155Offers(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    erc1155UpsertOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    erc721AcceptOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    erc721CancelOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    erc721CreateOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    erc721Offers(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    erc777AcceptOffer(
      contractAddress: string,
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    erc777CancelOffer(
      contractAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    erc777Offers(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    erc777UpsertOffer(
      contractAddress: string,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    erc1155AcceptOffer(
      contractAddress: string,
      from: string,
      to: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    erc1155CancelOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    erc1155Offers(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    erc1155UpsertOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    erc721AcceptOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    erc721CancelOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    erc721CreateOffer(
      contractAddress: string,
      tokenId: BigNumberish,
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    erc721Offers(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    erc777AcceptOffer(
      contractAddress: string,
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    erc777CancelOffer(
      contractAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    erc777Offers(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    erc777UpsertOffer(
      contractAddress: string,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
