import { ERC1193 } from './service';
import { WalletProfile } from './types';
import * as i0 from "@angular/core";
export declare class InjectedProviders extends ERC1193 {
    wallets: WalletProfile[];
    constructor();
    protected getWallet(): Promise<WalletProfile | undefined>;
    get account(): string | undefined;
    get chainId(): number | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<InjectedProviders, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InjectedProviders>;
}
