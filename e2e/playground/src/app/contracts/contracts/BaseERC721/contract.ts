import { NgZone } from "@angular/core";
import { FilterParam, TypedFilter } from "@ngeth/ethers-core";
import { NgContract } from "@ngeth/ethers-angular";
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
    Approval: { owner: string; approved: string; tokenId: BigNumber };
    ApprovalForAll: { owner: string; operator: string; approved: boolean };
    Transfer: { from: string; to: string; tokenId: BigNumber };
  };
}

export class BaseERC721 extends NgContract<BaseERC721Events> {
  // Read
  balanceOf!: (owner: string, overrides?: CallOverrides) => Promise<BigNumber>;
  getApproved!: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;
  isApprovedForAll!: (owner: string, operator: string, overrides?: CallOverrides) => Promise<boolean>;
  name!: (overrides?: CallOverrides) => Promise<string>;
  ownerOf!: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;
  supportsInterface!: (interfaceId: BytesLike, overrides?: CallOverrides) => Promise<boolean>;
  symbol!: (overrides?: CallOverrides) => Promise<string>;
  tokenURI!: (tokenId: BigNumberish, overrides?: CallOverrides) => Promise<string>;

  // Write
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
  setApprovalForAll!: (operator: string, approved: boolean, overrides?: Overrides) => Promise<ContractTransaction>;
  transferFrom!: (
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides
  ) => Promise<ContractTransaction>;

  constructor(address: string, signer?: Signer | Provider, zone?: NgZone) {
    super(address, abi, signer, zone);
  }
}
