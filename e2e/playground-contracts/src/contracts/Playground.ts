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

export interface PlaygroundEvents {
  events: {
    LogEvent: ((eventName: BytesLike, isTrue: boolean) => void) | ((eventName: BytesLike, account: string) => void);
  };
  filters: {};
  queries: {};
}

export class Playground extends NgContract<PlaygroundEvents> {
  // Read
  ["getEvent(bytes32)"]!: (_eventName: BytesLike, overrides?: CallOverrides) => Promise<void>;
  ["getEvent(address)"]!: (_account: string, overrides?: CallOverrides) => Promise<BigNumber>;

  // Write
  ["emitEvent(bytes32,address)"]!: (
    _eventName: BytesLike,
    _account: string,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  ["emitEvent(bytes32,bool)"]!: (
    _eventName: BytesLike,
    _isTrue: boolean,
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
