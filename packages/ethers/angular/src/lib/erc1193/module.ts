import { Type } from '@angular/core';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { NgERC1193 } from './service';
import { WalletProfile } from './types';


export function ethersProviders<T extends WalletProfile>(erc1193: Type<NgERC1193<T>>) {
  return [{
    provide: NgERC1193,
    useClass: erc1193
  },{
    provide: Provider,
    useFactory: (erc1193: NgERC1193) => erc1193.ethersProvider,
    deps: [NgERC1193]
  }, {
    provide: Signer,
    useFactory: (erc1193: NgERC1193) => erc1193.ethersSigner,
    deps: [NgERC1193]
  }]
  
}
