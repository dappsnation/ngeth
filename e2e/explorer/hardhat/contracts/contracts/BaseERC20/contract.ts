import { EthersContract, FilterParam, TypedFilter } from "@ngeth/ethers-core";
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
    Approval: {
      owner: string;
      spender: string;
      value: BigNumber;
    };
    Transfer: {
      from: string;
      to: string;
      value: BigNumber;
    };
  };
}

/**
 */
export class BaseERC20 extends EthersContract<BaseERC20Events> {
  // Read
  /**
   * See {IERC20-allowance}.
   */
  allowance!: (owner: string, spender: string, overrides?: CallOverrides) => Promise<BigNumber>;
  /**
   * See {IERC20-balanceOf}.
   */
  balanceOf!: (account: string, overrides?: CallOverrides) => Promise<BigNumber>;
  /**
   * Returns the number of decimals used to get its user representation. For example, if `decimals` equals `2`, a balance of `505` tokens should be displayed to a user as `5.05` (`505 / 10 ** 2`). Tokens usually opt for a value of 18, imitating the relationship between Ether and Wei. This is the value {ERC20} uses, unless this function is overridden; NOTE: This information is only used for _display_ purposes: it in no way affects any of the arithmetic of the contract, including {IERC20-balanceOf} and {IERC20-transfer}.
   */
  decimals!: (overrides?: CallOverrides) => Promise<number>;
  /**
   * Returns the name of the token.
   */
  name!: (overrides?: CallOverrides) => Promise<string>;
  /**
   * Returns the symbol of the token, usually a shorter version of the name.
   */
  symbol!: (overrides?: CallOverrides) => Promise<string>;
  /**
   * See {IERC20-totalSupply}.
   */
  totalSupply!: (overrides?: CallOverrides) => Promise<BigNumber>;

  // Write
  /**
   * See {IERC20-approve}. Requirements: - `spender` cannot be the zero address.
   */
  approve!: (spender: string, amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Atomically decreases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.
   */
  decreaseAllowance!: (
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Atomically increases the allowance granted to `spender` by the caller. This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}. Emits an {Approval} event indicating the updated allowance. Requirements: - `spender` cannot be the zero address.
   */
  increaseAllowance!: (
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * See {IERC20-transfer}. Requirements: - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.
   */
  transfer!: (recipient: string, amount: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * See {IERC20-transferFrom}. Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20}. Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for ``sender``'s tokens of at least `amount`.
   */
  transferFrom!: (
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;

  constructor(address: string, signer?: Signer | Provider) {
    super(address, abi, signer);
  }
}
