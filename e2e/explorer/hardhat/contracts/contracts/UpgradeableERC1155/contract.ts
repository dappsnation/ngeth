import { EthersContract } from "@ngeth/ethers-core";
import type { FilterParam, TypedFilter } from "@ngeth/ethers-core";
import type { Signer, BigNumber, CallOverrides, BigNumberish, ContractTransaction, Overrides, BytesLike } from "ethers";
import type { Provider } from "@ethersproject/providers";
import abi from "./abi";

export interface UpgradeableERC1155Events {
  events: {
    ApprovalForAll: (account: string, operator: string, approved: boolean) => void;
    OwnershipTransferred: (previousOwner: string, newOwner: string) => void;
    TransferBatch: (operator: string, from: string, to: string, ids: BigNumber[], values: BigNumber[]) => void;
    TransferSingle: (operator: string, from: string, to: string, id: BigNumber, value: BigNumber) => void;
    URI: (value: string, id: BigNumber) => void;
  };
  filters: {
    ApprovalForAll: (account?: FilterParam<string>, operator?: FilterParam<string>) => TypedFilter<"ApprovalForAll">;
    OwnershipTransferred: (
      previousOwner?: FilterParam<string>,
      newOwner?: FilterParam<string>
    ) => TypedFilter<"OwnershipTransferred">;
    TransferBatch: (
      operator?: FilterParam<string>,
      from?: FilterParam<string>,
      to?: FilterParam<string>
    ) => TypedFilter<"TransferBatch">;
    TransferSingle: (
      operator?: FilterParam<string>,
      from?: FilterParam<string>,
      to?: FilterParam<string>
    ) => TypedFilter<"TransferSingle">;
    URI: (id?: FilterParam<BigNumberish>) => TypedFilter<"URI">;
  };
  queries: {
    ApprovalForAll: {
      account: string;
      operator: string;
      approved: boolean;
    };
    OwnershipTransferred: {
      previousOwner: string;
      newOwner: string;
    };
    TransferBatch: {
      operator: string;
      from: string;
      to: string;
      ids: BigNumber[];
      values: BigNumber[];
    };
    TransferSingle: {
      operator: string;
      from: string;
      to: string;
      id: BigNumber;
      value: BigNumber;
    };
    URI: {
      value: string;
      id: BigNumber;
    };
  };
}

export class UpgradeableERC1155 extends EthersContract<UpgradeableERC1155Events> {
  // Read
  /**
   * See {IERC1155-balanceOf}. Requirements: - `account` cannot be the zero address.
   */
  balanceOf!: (account: string, id: BigNumberish, overrides?: CallOverrides) => Promise<BigNumber>;
  /**
   * See {IERC1155-balanceOfBatch}. Requirements: - `accounts` and `ids` must have the same length.
   */
  balanceOfBatch!: (accounts: string[], ids: BigNumberish[], overrides?: CallOverrides) => Promise<BigNumber[]>;
  contractURI!: (overrides?: CallOverrides) => Promise<string>;
  /**
   * See {IERC1155-isApprovedForAll}.
   */
  isApprovedForAll!: (account: string, operator: string, overrides?: CallOverrides) => Promise<boolean>;
  /**
   * Returns the address of the current owner.
   */
  owner!: (overrides?: CallOverrides) => Promise<string>;
  /**
   * See {IERC165-supportsInterface}.
   */
  supportsInterface!: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
  /**
   * See {IERC1155MetadataURI-uri}. This implementation returns the same URI for *all* token types. It relies on the token type ID substitution mechanism https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the EIP]. Clients calling this function must replace the `\{id\}` substring with the actual token type ID.
   */
  uri!: (arg: BigNumberish, overrides?: CallOverrides) => Promise<string>;

  // Write
  initialize!: (_tokenURI: string, overrides?: Overrides) => Promise<ContractTransaction>;
  mint!: (
    account: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  mintBatch!: (
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.
   */
  renounceOwnership!: (overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * See {IERC1155-safeBatchTransferFrom}.
   */
  safeBatchTransferFrom!: (
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * See {IERC1155-safeTransferFrom}.
   */
  safeTransferFrom!: (
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * See {IERC1155-setApprovalForAll}.
   */
  setApprovalForAll!: (operator: string, approved: boolean, overrides?: Overrides) => Promise<ContractTransaction>;
  setURI!: (newuri: string, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
   */
  transferOwnership!: (newOwner: string, overrides?: Overrides) => Promise<ContractTransaction>;

  constructor(address: string, signer?: Signer | Provider) {
    super(address, abi, signer);
  }
}
