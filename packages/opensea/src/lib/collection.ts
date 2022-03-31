import { Inject, Injectable } from '@angular/core';
import { IPFS, IPFSClient, ipfsToJson } from '@ngeth/ipfs';
import { OpenseaCollectionMetadata } from './types';

@Injectable({ providedIn: 'root' })
export class Opensea {
  constructor(@Inject(IPFS) private ipfs: IPFSClient) {}

  getCollection(contractUri: string): Promise<OpenseaCollectionMetadata> {
    const [protocol, location] = contractUri.split('//');
    if (protocol === 'ipfs:') {
      return ipfsToJson<OpenseaCollectionMetadata>(this.ipfs.cat(location));
    } else {
      return fetch(contractUri).then(res => res.json());
    }
  }
}