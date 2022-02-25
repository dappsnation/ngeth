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

export interface PlaygroundEvents {
  events: {
    LogEvent: ((eventName: BytesLike, isTrue: boolean) => void) | ((eventName: BytesLike, account: string) => void);
  };
  filters: {};
  queries: {};
}

export const abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes32", name: "eventName", type: "bytes32" },
      { indexed: false, internalType: "bool", name: "isTrue", type: "bool" },
    ],
    name: "LogEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bytes32", name: "eventName", type: "bytes32" },
      { indexed: false, internalType: "address", name: "account", type: "address" },
    ],
    name: "LogEvent",
    type: "event",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_eventName", type: "bytes32" },
      { internalType: "address", name: "_account", type: "address" },
    ],
    name: "emitEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_eventName", type: "bytes32" },
      { internalType: "bool", name: "_isTrue", type: "bool" },
    ],
    name: "emitEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_eventName", type: "bytes32" }],
    name: "getEvent",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "getEvent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export class Playground extends TypedContract<PlaygroundEvents> {
  constructor(signer?: Signer | Provider) {
    super(env.addresses.Playground, abi, signer);
  }

  ["getEvent(bytes32)"](_eventName: BytesLike, overrides?: CallOverrides): Promise<void> {
    return this.functions["getEvent(bytes32)"](...arguments);
  }
  ["getEvent(address)"](_account: string, overrides?: CallOverrides): Promise<BigNumber> {
    return this.functions["getEvent(address)"](...arguments);
  }

  ["emitEvent(bytes32,address)"](
    _eventName: BytesLike,
    _account: string,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    return this.functions["emitEvent(bytes32,address)"](...arguments);
  }
  ["emitEvent(bytes32,bool)"](
    _eventName: BytesLike,
    _isTrue: boolean,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    return this.functions["emitEvent(bytes32,bool)"](...arguments);
  }
}
