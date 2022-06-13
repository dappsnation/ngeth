import { Directive, ElementRef, forwardRef, HostListener, Injector, OnInit, Optional, Renderer2, Self } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormControl, NgControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { getAddress } from "@ethersproject/address";
import { EthValidators } from "../../form";

@Directive({
  selector: 'input[type="ethAddress"]',
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AddressInputDirective),
    multi: true
  }],
})
export class AddressInputDirective implements ControlValueAccessor, OnInit {
  private control?: AbstractControl | null;

  @HostListener('change', ['$event']) change(event: Event) {
    this.onChange((event.target as HTMLInputElement).value);
  }
  @HostListener('blur') blur() {
    this.onTouch();
  }

  private onChange: (value: string) => unknown = () => null;
  private onTouch = () => null;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef<HTMLInputElement>,
    private injector: Injector
  ) {}
  
  
  ngOnInit() {
    this.control = this.injector.get(NgControl)?.control;
    this.control?.addValidators(EthValidators.address)
  }

  private setProperty(key: string, value: unknown): void {
    this.renderer.setProperty(this.el.nativeElement, key, value);
  }

  async writeValue(value: string) {
    if (value) {
      this.setProperty('value', getAddress(value));
    } else {
      this.setProperty('value', '');
    }
  }

  registerOnChange(fn: (value: string) => null): void {
    this.onChange = (value: string) => {
      this.control?.markAsDirty();
      fn(getAddress(value));
    }
  }

  registerOnTouched(fn: () => null): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.setProperty('disabled', isDisabled);
  }
}