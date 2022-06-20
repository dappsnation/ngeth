import { NgZone } from '@angular/core';
import { Signer } from '@ethersproject/abstract-signer';
import * as i0 from "@angular/core";
export declare abstract class ContractsManager<T> {
    private contracts;
    private injector;
    protected zone: NgZone;
    protected get signer(): Signer;
    protected abstract createInstance(address: string): T;
    get(address: string, chainId: number): T;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContractsManager<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ContractsManager<any>>;
}
