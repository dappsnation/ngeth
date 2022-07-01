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

export interface IERC20Events {
  events: {
    /**
     * Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}. `value` is the new allowance.
     */
    Approval: (owner: string, spender: string, value: BigNumber) => void;
    /**
     * Emitted when `value` tokens are moved from one account (`from`) to another (`to`). Note that `value` may be zero.
     */
    Transfer: (from: string, to: string, value: BigNumber) => void;
  };
  filters: {
    /**
     * Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}. `value` is the new allowance.
     */
    Approval: (owner?: FilterParam<string>, spender?: FilterParam<string>) => TypedFilter<"Approval">;
    /**
     * Emitted when `value` tokens are moved from one account (`from`) to another (`to`). Note that `value` may be zero.
     */
    Transfer: (from?: FilterParam<string>, to?: FilterParam<string>) => TypedFilter<"Transfer">;
  };
  queries: {
    /** Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}. `value` is the new allowance. */
    Approval: {
      owner: string;
      spender: string;
      value: BigNumber;
    };
    /** Emitted when `value` tokens are moved from one account (`from`) to another (`to`). Note that `value` may be zero. */
    Transfer: {
      from: string;
      to: string;
      value: BigNumber;
    };
  };
}

/**
 * Interface of the ERC20 standard as defined in the EIP.
 */
export interface IERC20 extends EthersContract<IERC20Events> {
  /**
   * Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through {transferFrom}. This is zero by default. This value changes when {approve} or {transferFrom} are called.
   */
  allowance: (owner: string, spender: string, overrides?: CallOverrides) => Promise<BigNumber>;
  /**
   * Returns the amount of tokens owned by `account`.
   */
  balanceOf: (account: string, overrides?: CallOverrides) => Promise<BigNumber>;
  /**
   * Returns the amount of tokens in existence.
   */
  totalSupply: (overrides?: CallOverrides) => Promise<BigNumber>;
  /**
   * Sets `amount` as the allowance of `spender` over the caller's tokens. Returns a boolean value indicating whether the operation succeeded. IMPORTANT: Beware that changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729 Emits an {Approval} event.
   */
  approve: (spender: string, amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Moves `amount` tokens from the caller's account to `recipient`. Returns a boolean value indicating whether the operation succeeded. Emits a {Transfer} event.
   */
  transfer: (recipient: string, amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Moves `amount` tokens from `sender` to `recipient` using the allowance mechanism. `amount` is then deducted from the caller's allowance. Returns a boolean value indicating whether the operation succeeded. Emits a {Transfer} event.
   */
  transferFrom: (
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
}

export const IERC20Abi = [
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
