import { PipeTransform } from '@angular/core';
import { BigNumber } from 'ethers';
import { ERC20Metadata } from './types';
import * as i0 from "@angular/core";
export declare class ERC20Pipe implements PipeTransform {
    private _locale;
    constructor(_locale: string);
    transform(balance: BigNumber, metadata: ERC20Metadata, digitInfo?: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ERC20Pipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<ERC20Pipe, "erc20", false>;
}
