import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ExternalProvider, Web3Provider, Provider, JsonRpcSigner, BlockTag, FeeData, JsonRpcProvider, TransactionRequest, TransactionResponse } from '@ethersproject/providers';
import { Signer, TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { Bytes, BigNumber } from 'ethers';
import { Deferrable } from 'ethers/lib/utils';

// export const ETH_PROVIDER = new InjectionToken<ExternalProvider | undefined>('Injected Ethereum Provider', {
//   providedIn: 'root',
//   factory: () => (window as any).ethereum
// });


@Injectable({ providedIn: 'root' })
export class WebProvider extends Web3Provider {
  constructor() {
    super((window as any).ethereum);
  }
}

@Injectable({ providedIn: 'root' })
export class WebSigner implements JsonRpcSigner {
  _isSigner!: boolean;
  provider!: JsonRpcProvider;
  _index!: number;
  _address!: string;
  
  connect!: (provider: Provider) => JsonRpcSigner;
  connectUnchecked!: () => JsonRpcSigner
  getAddress!: () => Promise<string>
  sendUncheckedTransaction!: (transaction: Deferrable<TransactionRequest>) => Promise<string>
  signTransaction!: (transaction: Deferrable<TransactionRequest>) => Promise<string>
  sendTransaction!: (transaction: Deferrable<TransactionRequest>) => Promise<TransactionResponse>
  signMessage!: (message: string | Bytes) => Promise<string>
  _legacySignMessage!: (message: string | Bytes) => Promise<string>
  _signTypedData!: (domain: TypedDataDomain, types: Record<string, TypedDataField[]>, value: Record<string, any>) => Promise<string>
  unlock!: (password: string) => Promise<boolean>
  getBalance!: (blockTag?: BlockTag) => Promise<BigNumber>
  getTransactionCount!: (blockTag?: BlockTag) => Promise<number>
  estimateGas!: (transaction: Deferrable<TransactionRequest>) => Promise<BigNumber>
  call!: (transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag) => Promise<string>
  getChainId!: () => Promise<number>
  getGasPrice!: () => Promise<BigNumber>
  getFeeData!: () => Promise<FeeData>
  resolveName!: (name: string) => Promise<string>
  checkTransaction!: (transaction: Deferrable<TransactionRequest>) => Deferrable<TransactionRequest>
  populateTransaction!: (transaction: Deferrable<TransactionRequest>) => Promise<TransactionRequest>
  _checkProvider!: (operation?: string) => void
  
  constructor(provider: WebProvider) {
    return provider.getSigner();
  }
}