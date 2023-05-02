import { EthersContract } from "@ngeth/ethers-core";
import type { FilterParam, TypedFilter } from "@ngeth/ethers-core";
import type { BigNumber, CallOverrides, BigNumberish, ContractTransaction, Overrides, BytesLike } from "ethers";

export interface IERC1155Events {
  events: {
    /**
     * Emitted when `account` grants or revokes permission to `operator` to transfer their tokens, according to `approved`.
     */
    ApprovalForAll: (account: string, operator: string, approved: boolean) => void;
    /**
     * Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all transfers.
     */
    TransferBatch: (operator: string, from: string, to: string, ids: BigNumber[], values: BigNumber[]) => void;
    /**
     * Emitted when `value` tokens of token type `id` are transferred from `from` to `to` by `operator`.
     */
    TransferSingle: (operator: string, from: string, to: string, id: BigNumber, value: BigNumber) => void;
    /**
     * Emitted when the URI for token type `id` changes to `value`, if it is a non-programmatic URI. If an {URI} event was emitted for `id`, the standard https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that `value` will equal the value returned by {IERC1155MetadataURI-uri}.
     */
    URI: (value: string, id: BigNumber) => void;
  };
  filters: {
    /**
     * Emitted when `account` grants or revokes permission to `operator` to transfer their tokens, according to `approved`.
     */
    ApprovalForAll: (account?: FilterParam<string>, operator?: FilterParam<string>) => TypedFilter<"ApprovalForAll">;
    /**
     * Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all transfers.
     */
    TransferBatch: (
      operator?: FilterParam<string>,
      from?: FilterParam<string>,
      to?: FilterParam<string>
    ) => TypedFilter<"TransferBatch">;
    /**
     * Emitted when `value` tokens of token type `id` are transferred from `from` to `to` by `operator`.
     */
    TransferSingle: (
      operator?: FilterParam<string>,
      from?: FilterParam<string>,
      to?: FilterParam<string>
    ) => TypedFilter<"TransferSingle">;
    /**
     * Emitted when the URI for token type `id` changes to `value`, if it is a non-programmatic URI. If an {URI} event was emitted for `id`, the standard https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that `value` will equal the value returned by {IERC1155MetadataURI-uri}.
     */
    URI: (id?: FilterParam<BigNumberish>) => TypedFilter<"URI">;
  };
  queries: {
    /** Emitted when `account` grants or revokes permission to `operator` to transfer their tokens, according to `approved`. */
    ApprovalForAll: {
      account: string;
      operator: string;
      approved: boolean;
    };
    /** Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all transfers. */
    TransferBatch: {
      operator: string;
      from: string;
      to: string;
      ids: BigNumber[];
      values: BigNumber[];
    };
    /** Emitted when `value` tokens of token type `id` are transferred from `from` to `to` by `operator`. */
    TransferSingle: {
      operator: string;
      from: string;
      to: string;
      id: BigNumber;
      value: BigNumber;
    };
    /** Emitted when the URI for token type `id` changes to `value`, if it is a non-programmatic URI. If an {URI} event was emitted for `id`, the standard https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that `value` will equal the value returned by {IERC1155MetadataURI-uri}. */
    URI: {
      value: string;
      id: BigNumber;
    };
  };
}

/**
 * Required interface of an ERC1155 compliant contract, as defined in the https://eips.ethereum.org/EIPS/eip-1155[EIP]. _Available since v3.1._
 */
export interface IERC1155 extends EthersContract<IERC1155Events> {
  /**
   * Returns the amount of tokens of token type `id` owned by `account`. Requirements: - `account` cannot be the zero address.
   */
  balanceOf: (account: string, id: BigNumberish, overrides?: CallOverrides) => Promise<BigNumber>;
  /**
   * xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {balanceOf}. Requirements: - `accounts` and `ids` must have the same length.
   */
  balanceOfBatch: (accounts: string[], ids: BigNumberish[], overrides?: CallOverrides) => Promise<BigNumber[]>;
  /**
   * Returns true if `operator` is approved to transfer ``account``'s tokens. See {setApprovalForAll}.
   */
  isApprovedForAll: (account: string, operator: string, overrides?: CallOverrides) => Promise<boolean>;
  /**
   * Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created. This function call must use less than 30 000 gas.
   */
  supportsInterface: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
  /**
   * xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {safeTransferFrom}. Emits a {TransferBatch} event. Requirements: - `ids` and `amounts` must have the same length. - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the acceptance magic value.
   */
  safeBatchTransferFrom: (
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Transfers `amount` tokens of token type `id` from `from` to `to`. Emits a {TransferSingle} event. Requirements: - `to` cannot be the zero address. - If the caller is not `from`, it must be have been approved to spend ``from``'s tokens via {setApprovalForAll}. - `from` must have a balance of tokens of type `id` of at least `amount`. - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the acceptance magic value.
   */
  safeTransferFrom: (
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`, Emits an {ApprovalForAll} event. Requirements: - `operator` cannot be the caller.
   */
  setApprovalForAll: (operator: string, approved: boolean, overrides?: Overrides) => Promise<ContractTransaction>;
}

export const IERC1155Abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "account", type: "address" },
      { indexed: true, internalType: "address", name: "operator", type: "address" },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "operator", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { indexed: false, internalType: "uint256[]", name: "values", type: "uint256[]" },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "operator", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "value", type: "string" },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "accounts", type: "address[]" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    ],
    name: "balanceOfBatch",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];
