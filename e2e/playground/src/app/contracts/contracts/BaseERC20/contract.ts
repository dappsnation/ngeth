import { NgZone } from "@angular/core";
import { NgContract, FilterParam, TypedFilter } from "@ngeth/ethers";
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

export class BaseERC20 extends NgContract<BaseERC20Events> {
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

  constructor(address: string, signer?: Signer | Provider, zone?: NgZone) {
    super(address, abi, signer, zone);
  }
}
