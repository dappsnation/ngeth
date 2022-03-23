import { NgContract, FilterParam, TypedFilter } from "@ngeth/ethers";
import { BigNumber, Overrides, CallOverrides, Signer, ContractTransaction, BigNumberish } from "ethers";
import { Provider } from "@ethersproject/providers";
import { combineLatest, map, shareReplay } from "rxjs";
import { erc20Balance } from "../utils";
import { NgZone } from "@angular/core";
import { ERC20Metadata } from "./types";

export interface BaseERC20Events {
  events: {
    Approval: (owner: string, spender: string, value: BigNumber) => void;
    Transfer: (from: string, to: string, value: BigNumber) => void;
  };
  filters: {
    Approval: (owner?: FilterParam<string>, spender?: FilterParam<string>) => TypedFilter<"Approval">;
    Transfer: (from?: FilterParam<string>, to?: FilterParam<string>) => TypedFilter<"Transfer">;
  };
  queries: {
    Approval: { owner: string; spender: string; value: BigNumber };
    Transfer: { from: string; to: string; value: BigNumber };
  };
}


export class ERC20 extends NgContract<BaseERC20Events> {
  private metadata?: ERC20Metadata;
  // Read
  allowance!: (owner: string, spender: string, overrides?: CallOverrides) => Promise<BigNumber>;
  balanceOf!: (account: string, overrides?: CallOverrides) => Promise<BigNumber>;
  decimals!: (overrides?: CallOverrides) => Promise<number>;
  name!: (overrides?: CallOverrides) => Promise<string>;
  symbol!: (overrides?: CallOverrides) => Promise<string>;
  totalSupply!: (overrides?: CallOverrides) => Promise<BigNumber>;

  // Write
  approve!: (spender: string, amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  decreaseAllowance!: (
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  increaseAllowance!: (
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  transfer!: (recipient: string, amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  transferFrom!: (
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;

  constructor(address: string, signer: Signer | Provider, ngZone: NgZone) {
    super(address, ERC20_abi, signer, ngZone);
  }

  exist() {
    return this.name()
      .then(() => true)
      .catch(() => false);
  }

  /** Listen on the changes of a balance of an address */
  balanceChanges(address: string) {
    const received = this.filters.Transfer(null, address);
    const sent = this.filters.Transfer(address);
    return combineLatest([
      this.from(received),
      this.from(sent),
    ]).pipe(
      map(([received, sent]) => erc20Balance(received, sent)),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  async getMetadata() {
    if (!this.metadata) {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.name(),
        this.symbol(),
        this.decimals(),
        this.totalSupply(),
      ]);
      this.metadata = { name, symbol, decimals, totalSupply };
    }
    return this.metadata;
  }
}

export const ERC20_abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "spender", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
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
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
