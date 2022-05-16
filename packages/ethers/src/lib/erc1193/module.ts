import { Type } from '@angular/core';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { ERC1193 } from './service';
import { WalletProfile } from './types';


export function ethersProviders<T extends WalletProfile>(erc1193: Type<ERC1193<T>>) {
  return [{
    provide: ERC1193,
    useClass: erc1193
  },{
    provide: Provider,
    useFactory: (erc1193: ERC1193) => erc1193.ethersProvider,
    deps: [ERC1193]
  }, {
    provide: Signer,
    useFactory: (erc1193: ERC1193) => erc1193.ethersSigner,
    deps: [ERC1193]
  }]
  
}
