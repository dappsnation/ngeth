import { ElementRef, Renderer2 } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import type { BigNumberish } from "ethers";
import { Chain, ChainId } from "@ngeth/ethers-core";
import { ChainManager } from "../../chain";
import * as i0 from "@angular/core";
export declare class EtherInputDirective implements ControlValueAccessor {
    private chainManager;
    private renderer;
    private el;
    chain?: Chain;
    set chainId(id: ChainId | null);
    change(event: Event): void;
    blur(): void;
    private onChange;
    private onTouch;
    constructor(chainManager: ChainManager, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    private setProperty;
    private setChain;
    get decimals(): number | undefined;
    writeValue(value: BigNumberish): Promise<void>;
    registerOnChange(fn: (value: BigNumberish) => null): void;
    registerOnTouched(fn: () => null): void;
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EtherInputDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<EtherInputDirective, "input[type=\"ether\"]", never, { "chainId": "chainId"; }, {}, never, never, false>;
}
