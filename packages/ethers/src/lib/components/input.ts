import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BigNumberish } from "ethers";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { Chain, ChainId, ChainManager } from "../chain";

@Directive({
  selector: 'input[type="eth"]',
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EtherInputDirective),
    multi: true
  }],
})
export class EtherInputDirective implements ControlValueAccessor {
  chain?: Chain;
  @Input() set chainId(id: ChainId | null) {
    this.setChain(id);
  }

  @HostListener('change', ['$event']) change(event: Event) {
    this.onChange((event.target as HTMLInputElement).value);
  }
  @HostListener('blur') blur() {
    this.onTouch();
  }

  private onChange: (value: string) => unknown = () => null;
  private onTouch = () => null;

  constructor(
    private chainManager: ChainManager,
    private renderer: Renderer2,
    private el: ElementRef<HTMLInputElement>,
  ) { }

  private setProperty(key: string, value: unknown): void {
    this.renderer.setProperty(this.el.nativeElement, key, value);
  }

  private async setChain(id?: ChainId | null) {
    this.chain = id
      ? await this.chainManager.getChain(id)
      : await this.chainManager.getChain();
  }

  get decimals() {
    return this.chain?.nativeCurrency.decimals;
  }
  
  async writeValue(value: BigNumberish) {
    if (value) {
      this.setProperty('value', formatUnits(value, this.chain?.nativeCurrency.decimals));
    } else {
      this.setProperty('value', '');
    }
  }

  registerOnChange(fn: (value: BigNumberish) => null): void {
    this.onChange = (value: string) => {
      fn(parseUnits(value, this.decimals));
    }
  }

  registerOnTouched(fn: () => null): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.setProperty('disabled', isDisabled);
  }
}