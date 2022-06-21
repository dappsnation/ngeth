import { ElementRef, Injector, OnInit, Renderer2 } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import * as i0 from "@angular/core";
export declare class AddressInputDirective implements ControlValueAccessor, OnInit {
    private renderer;
    private el;
    private injector;
    private control?;
    change(event: Event): void;
    blur(): void;
    private onChange;
    private onTouch;
    constructor(renderer: Renderer2, el: ElementRef<HTMLInputElement>, injector: Injector);
    ngOnInit(): void;
    private setProperty;
    writeValue(value: string): Promise<void>;
    registerOnChange(fn: (value: string) => null): void;
    registerOnTouched(fn: () => null): void;
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AddressInputDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AddressInputDirective, "input[type=\"ethAddress\"]", never, {}, {}, never, never, false>;
}
