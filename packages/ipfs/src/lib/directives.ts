import { Directive, HostBinding, Inject, Input } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ipfsToBlobUrl } from "./utils";
import { IPFS, IPFSClient } from "./tokens";
import type { CID } from "ipfs-http-client";

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