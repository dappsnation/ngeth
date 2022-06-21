import { InjectionToken } from "@angular/core";
import type { ChainIcon, Chain, SupportedChains, ChainId } from "@ngeth/ethers-core";
import { Provider } from '@ethersproject/providers';
import { ERC1193 } from "../erc1193";
import * as i0 from "@angular/core";
export declare const CUSTOM_CHAINS: InjectionToken<Record<string, Chain>>;
export declare const SUPPORTED_CHAINS: InjectionToken<SupportedChains>;
export declare function getChain(chainId: string | number): Promise<Chain>;
export declare function getChainIcons(name: string, format?: ChainIcon['format']): Promise<ChainIcon>;
export declare class ChainManager {
    private provider;
    private customChains;
    private erc1193?;
    private chains;
    private icons;
    chain$: import("rxjs").Observable<Chain>;
    constructor(provider: Provider, customChains: Record<string, Chain>, erc1193?: ERC1193<import("../erc1193").WalletProfile> | undefined);
    private currentChain;
    getChain(chainId?: ChainId): Promise<Chain>;
    getIcon(name: string, format?: ChainIcon['format']): Promise<ChainIcon>;
    explore(search: string, chainId?: ChainId): Promise<string | undefined>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChainManager, [null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ChainManager>;
}
