import type { Signer } from 'ethers';
import { Injectable, NgZone } from '@angular/core';
import { erc1155Tokens, MetaMask } from '@ngeth/ethers';
import { Opensea, OpenseaCollectionMetadata } from '@ngeth/opensea';
import { OpenseaERC1155 } from '../contracts';
import { combineLatest, map, switchMap } from 'rxjs';
import { getAddress } from '@ethersproject/address';

interface OpenseaERC1155Interface {
  contractUri: string;
  address: string;
  collection: OpenseaCollectionMetadata;
}

export class BaseContract extends OpenseaERC1155 {
  private json?: OpenseaERC1155Interface;

  constructor(address: string, signer: Signer, zone: NgZone, private opensea: Opensea) {
    super(address, signer, zone);
  }

  async toJSON() {
    if (!this.json) {
      const contractUri = await this.contractURI();
      const collection = await this.opensea.getCollection(contractUri);
      this.json = { contractUri, address: this.address, collection };
    }
    return this.json;
  }

  exist() {
    return this.uri(0)
      .then(() => true)
      .catch(() => false);
  }

  isOwner(address: string) {
    const ownerChanges = this.filters.OwnershipTransferred(null, address);
    return this.from(ownerChanges).pipe(
      switchMap(() => this.owner()),
      map(owner => address === getAddress(owner))
    )
  }

  tokensChanges(address: string) {
    const received = this.filters.TransferSingle(null, null, address);
    const batchReceived = this.filters.TransferBatch(null, null, address);
    const sent = this.filters.TransferSingle(null, address);
    const batchSent = this.filters.TransferBatch(null, address);

    return combineLatest([
      this.from(received),
      this.from(batchReceived),
      this.from(sent),
      this.from(batchSent),
    ]).pipe(
      map(([received, batchReceived, sent, batchSent]) => erc1155Tokens(received, batchReceived, sent, batchSent))
    );
  }
}


@Injectable()
export class BaseContractsManager {
  private contracts: Record<string, Record<string, BaseContract>> = {};

  constructor(
    private opensea: Opensea,
    private metamask: MetaMask,
    private zone: NgZone
  ) {}

  get(address: string, chainId: number): BaseContract {
    if (!this.contracts[chainId]) this.contracts[chainId] = {};
    if (!this.contracts[chainId][address]) {
      const contract = new BaseContract(address, this.metamask.getSigner(), this.zone, this.opensea);
      this.contracts[chainId][address] = contract;
    }
    return this.contracts[chainId][address] as BaseContract;
  }
}