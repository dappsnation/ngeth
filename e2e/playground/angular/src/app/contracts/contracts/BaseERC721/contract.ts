import { EthersContract } from "@ngeth/ethers-core";
import type { FilterParam, TypedFilter } from "@ngeth/ethers-core";
import type { Signer, BigNumber, ContractTransaction, Overrides, BigNumberish, CallOverrides, BytesLike } from "ethers";
import type { Provider } from "@ethersproject/providers";
import abi from "./abi";

export interface BaseERC721Events {
  events: {
    Approval: (owner: string, approved: string, tokenId: BigNumber) => void;
    ApprovalForAll: (owner: string, operator: string, approved: boolean) => void;
    Transfer: (from: string, to: string, tokenId: BigNumber) => void;
  };
  filters: {
    Approval: (
      owner?: FilterParam<string>,
      approved?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"Approval">;
    ApprovalForAll: (owner?: FilterParam<string>, operator?: FilterParam<string>) => TypedFilter<"ApprovalForAll">;
    Transfer: (
      from?: FilterParam<string>,
      to?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"Transfer">;
  };
  queries: {
    Approval: {
      owner: string;
      approved: string;
      tokenId: BigNumber;
    };
    ApprovalForAll: {
      owner: string;
      operator: string;
      approved: boolean;
    };
    Transfer: {
      from: string;
      to: string;
      tokenId: BigNumber;
    };
  };
}

export class BaseERC721 extends EthersContract<BaseERC721Events> {
  // Read
  /**
   * See {IERC721-balanceOf}.
   */
  balanceOf!: (owner: string, overrides?: CallOverrides) => Promise<BigNumber>;
  /**
   * See {IERC721-getApproved}.
   */
  getApproved!: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;
  /**
   * See {IERC721-isApprovedForAll}.
   */
  isApprovedForAll!: (owner: string, operator: string, overrides?: CallOverrides) => Promise<boolean>;
  /**
   * See {IERC721Metadata-name}.
   */
  name!: (overrides?: CallOverrides) => Promise<string>;
  /**
   * See {IERC721-ownerOf}.
   */
  ownerOf!: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;
  /**
   * See {IERC165-supportsInterface}.
   */
  supportsInterface!: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
  /**
   * See {IERC721Metadata-symbol}.
   */
  symbol!: (overrides?: CallOverrides) => Promise<string>;
  /**
   * See {IERC721Metadata-tokenURI}.
   */
  tokenURI!: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;

  // Write
  /**
   * See {IERC721-approve}.
   */
  approve!: (to: string, tokenId: BigNumberish, overrides?: Overrides) => Promise<ContractTransaction>;
  ["safeTransferFrom(address,address,uint256)"]!: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  ["safeTransferFrom(address,address,uint256,bytes)"]!: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;
  /**
   * See {IERC721-setApprovalForAll}.
   */
  setApprovalForAll!: (operator: string, approved: boolean, overrides?: Overrides) => Promise<ContractTransaction>;
  /**
   * See {IERC721-transferFrom}.
   */
  transferFrom!: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;

  constructor(address: string, signer?: Signer | Provider) {
    super(address, abi, signer);
  }
}
