import { PipeTransform } from '@angular/core';
import { BigNumberish } from 'ethers';
import { Chain, ChainId, SupportedChains } from '@ngeth/ethers-core';
import { ChainManager } from './chain';
import * as i0 from "@angular/core";
export declare class BigNumberPipe implements PipeTransform {
    transform(value: BigNumberish): string | number;
    static ɵfac: i0.ɵɵFactoryDeclaration<BigNumberPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<BigNumberPipe, "bignumber", false>;
}
export declare class EtherPipe implements PipeTransform {
    transform(value?: BigNumberish | null): string | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<EtherPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<EtherPipe, "ether", false>;
}
export declare class EthCurrencyPipe implements PipeTransform {
    private chain?;
    constructor(chain?: ChainManager | undefined);
    transform(value?: BigNumberish | null, chainId?: ChainId): Promise<string | import("rxjs").Observable<string> | undefined>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EthCurrencyPipe, [{ optional: true; }]>;
    static ɵpipe: i0.ɵɵPipeDeclaration<EthCurrencyPipe, "ethCurrency", false>;
}
export declare class ChainPipe implements PipeTransform {
    private chain;
    constructor(chain: ChainManager);
    transform(chainId: ChainId): Promise<Chain>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChainPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<ChainPipe, "chain", false>;
}
export declare class ExplorePipe implements PipeTransform {
    transform(search: string, chain: Chain): string | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExplorePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<ExplorePipe, "explore", false>;
}
export declare class SupportedChainPipe implements PipeTransform {
    private supportedChains;
    constructor(supportedChains: SupportedChains);
    transform(chainId: string | number): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<SupportedChainPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<SupportedChainPipe, "supportedChain", false>;
}
export declare class AddressPipe implements PipeTransform {
    transform(address: string, format?: 'short' | 'full'): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<AddressPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<AddressPipe, "address", false>;
}
export declare const ethersPipes: (typeof BigNumberPipe | typeof EthCurrencyPipe | typeof ChainPipe | typeof ExplorePipe | typeof SupportedChainPipe | typeof AddressPipe)[];
