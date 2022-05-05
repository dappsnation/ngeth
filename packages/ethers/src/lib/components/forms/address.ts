import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { getAddress } from "@ethersproject/address";

@Directive({
  selector: 'input[type="ethAddress"]',
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AddressInputDirective),
    multi: true
  }],
})
export class AddressInputDirective implements ControlValueAccessor {

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
  ) { }

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