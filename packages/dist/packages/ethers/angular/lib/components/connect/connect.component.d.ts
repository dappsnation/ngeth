import { ElementRef } from '@angular/core';
import { ERC1193, WalletProfile } from '../../erc1193';
import * as i0 from "@angular/core";
interface DialogElement extends HTMLElement {
    showModal: () => void;
}
export declare class EthConnectComponent {
    private erc1193;
    selectDialog: ElementRef<DialogElement>;
    wallets: WalletProfile[];
    account$: import("rxjs").Observable<string | undefined>;
    connected$: import("rxjs").Observable<boolean | undefined>;
    constructor(erc1193: ERC1193);
    select(wallet: WalletProfile): void;
    enable(): void | Promise<string[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EthConnectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EthConnectComponent, "eth-connect", never, {}, {}, never, never, false>;
}
export {};
