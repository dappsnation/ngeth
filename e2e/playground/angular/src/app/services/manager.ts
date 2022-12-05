import type { Signer } from 'ethers';
import { Injectable, NgZone } from '@angular/core';
import { ContractsManager, NgContract, ngContract } from '@ngeth/ethers-angular';
import { erc1155Tokens } from '@ngeth/ethers-core';
import { Opensea, OpenseaCollectionMetadata } from '@ngeth/opensea';
import { OpenseaERC1155 } from '../contracts';
import { combineLatest, map, switchMap } from 'rxjs';
import { getAddress } from '@ethersproject/address';

interface OpenseaERC1155Interface {
  contractUri: string;
  address: string;
  collection: OpenseaCollectionMetadata;
}

export class BaseContract extends ngContract(OpenseaERC1155) {
  private json?: OpenseaERC1155Interface;

  constructor(
    address: string,
    signer: Signer,
    zone: NgZone,
    private opensea: Opensea,
  ) {
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
export class BaseContractsManager extends ContractsManager<BaseContract> {
  constructor(private opensea: Opensea) {
    super();
  }

  protected createInstance(address: string) {
    return new BaseContract(address, this.signer, this.zone, this.opensea);
  }
}