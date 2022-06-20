import { Type } from '@angular/core';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { ERC1193 } from './service';
import { WalletProfile } from './types';
export declare function ethersProviders<T extends WalletProfile>(erc1193: Type<ERC1193<T>>): ({
    provide: typeof ERC1193;
    useClass: Type<ERC1193<T>>;
    useFactory?: undefined;
    deps?: undefined;
} | {
    provide: typeof Provider;
    useFactory: (erc1193: ERC1193) => import("@ethersproject/providers").Web3Provider | undefined;
    deps: (typeof ERC1193)[];
    useClass?: undefined;
} | {
    provide: typeof Signer;
    useFactory: (erc1193: ERC1193) => import("@ethersproject/providers").JsonRpcSigner | undefined;
    deps: (typeof ERC1193)[];
    useClass?: undefined;
})[];
