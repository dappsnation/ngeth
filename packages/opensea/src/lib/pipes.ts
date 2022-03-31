import { Inject, Pipe, PipeTransform } from '@angular/core';
import { ipfsToJson, IPFS, IPFSClient } from '@ngeth/ipfs';
import { OpenseaCollectionMetadata } from './types';

@Pipe({ name: 'contractUri' })
export class ContractUriPipe implements PipeTransform {
  constructor(@Inject(IPFS) private ipfs: IPFSClient) {}
  transform(uri: string): Promise<OpenseaCollectionMetadata> {
    const [protocol, location] = uri.split('//');
    if (protocol === 'ipfs:') {
      return ipfsToJson<OpenseaCollectionMetadata>(this.ipfs.cat(location));
    } else {
      return fetch(uri).then(res => res.json());
    }
  }
}