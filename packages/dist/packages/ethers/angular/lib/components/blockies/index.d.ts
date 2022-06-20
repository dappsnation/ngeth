import { ElementRef, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
export declare class BlockiesComponent {
    private el;
    private renderer;
    private previous?;
    title?: string;
    set address(address: string | undefined | null);
    constructor(el: ElementRef<HTMLElement>, renderer: Renderer2);
    static ɵfac: i0.ɵɵFactoryDeclaration<BlockiesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BlockiesComponent, "eth-blockies", never, { "address": "address"; }, {}, never, ["*"], false>;
}
