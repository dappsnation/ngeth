import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { ERC1193 } from './service';
import { ERC1193Provider } from './types';


@NgModule()
export class EthersProviderModule {
  static forRoot<T extends ERC1193Provider>(erc1193: Type<ERC1193<T>>): ModuleWithProviders<EthersProviderModule> {
    return {
      ngModule: EthersProviderModule,
      providers: [{
        provide: ERC1193,
        useClass: erc1193
      },{
        provide: Provider,
        useFactory: (erc1193: ERC1193) => erc1193.getProvider(),
        deps: [ERC1193]
      }, {
        provide: Signer,
        useFactory: (erc1193: ERC1193) => erc1193.getSigner(),
        deps: [ERC1193]
      }]
    }
  }
}