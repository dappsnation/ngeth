import { EthersContract, FilterParam, TypedFilter } from "@ngeth/ethers-core";
import type {
  Contract,
  BigNumber,
  Overrides,
  CallOverrides,
  PayableOverrides,
  Signer,
  ContractTransaction,
  BytesLike,
  BigNumberish,
} from "ethers";

export interface IERC20MetadataEvents {
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

/**
 * Interface for the optional metadata functions from the ERC20 standard.
 * _Available since v4.1._
 */
export interface IERC20Metadata extends EthersContract<IERC20MetadataEvents> {
  allowance: (owner: string, spender: string, overrides?: CallOverrides) => Promise<BigNumber>;
  balanceOf: (account: string, overrides?: CallOverrides) => Promise<BigNumber>;
  /**
   * Returns the decimals places of the token.
   */
  decimals: (overrides?: CallOverrides) => Promise<number>;
  /**
   * Returns the name of the token.
   */
  name: (overrides?: CallOverrides) => Promise<string>;
  /**
   * Returns the symbol of the token.
   */
  symbol: (overrides?: CallOverrides) => Promise<string>;
  totalSupply: (overrides?: CallOverrides) => Promise<BigNumber>;
  approve: (spender: string, amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  transfer: (recipient: string, amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  transferFrom: (
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
}

export const IERC20MetadataAbi = [
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
