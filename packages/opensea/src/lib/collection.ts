import { Injectable } from '@angular/core';
import { ContractFactory } from '@ethersproject/contracts';

function isContractMetadata(data: any) {
  return true;
}

const abi: any[] = [];
const bytecode = '';

@Injectable({ providedIn: 'root' })
export class OpenseaCollection {

  async create(contractURI: string, uri: string) {
    const metadata = await fetch(contractURI);
    if (!isContractMetadata(metadata)) throw new Error('Metadata do not match Opensea contract metadata');
    const factory = new ContractFactory(abi, bytecode);
    return factory.deploy(contractURI, uri);
  }

}