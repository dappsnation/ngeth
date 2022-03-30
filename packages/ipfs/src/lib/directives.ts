import { Directive, ElementRef, forwardRef, HostBinding, HostListener, Inject, Input, Renderer2 } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ipfsToBlob, ipfsToBlobUrl } from "./utils";
import { IPFS, IPFSClient } from "./tokens";
import type { CID } from "ipfs-http-client";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, } from "@angular/forms";

@Directive({ selector: 'img[ipfsCid]' })
export class IpfsImgDirective {
  @HostBinding() src?: SafeUrl;
  @Input() set cid(cid: string | CID) {
    ipfsToBlobUrl(this.ipfs.cat(cid))
      .then(url => this.sanitizer.bypassSecurityTrustUrl(url))
      .then(src => this.src = src);
  }

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(IPFS) private ipfs: IPFSClient,
  ) {}
}

@Directive({
  selector: 'input[type="file"][ipfsInput]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IpfsInputDirective),
    multi: true
  }]
})
export class IpfsInputDirective implements ControlValueAccessor {
  private onChange: (file: File) => unknown = () => null;
  private onTouch = () => null;

  @HostListener('change', ['$event']) changed(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (!file) return;
    this.onChange(file);
  }
  @HostListener('blur') blurred() {
    this.onTouch();
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef<HTMLInputElement>,
    @Inject(IPFS) private ipfs: IPFSClient
  ) {}

  protected setProperty(key: string, value: unknown): void {
    this.renderer.setProperty(this.el.nativeElement, key, value);
  }

  async writeValue(cid: CID) {
    if (!cid) return;
    const stream = this.ipfs.cat(cid);
    const blob = await ipfsToBlob(stream);
    this.setProperty('value', blob);
  }
  registerOnChange(fn: (path: string) => null): void {
    this.onChange = async (file: File) => {
      const { path } = await this.ipfs.add(file);
      fn(path);
    }
  }
  registerOnTouched(fn: () => null): void {
    this.onTouch = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.setProperty('disabled', isDisabled);
  }
}
