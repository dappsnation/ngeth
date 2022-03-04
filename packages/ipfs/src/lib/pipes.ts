import { inject, Pipe, PipeTransform } from "@angular/core";
import type { CID } from "ipfs-http-client";
import { IPFS } from "./token";
import { decodeIpfsTo, IpfsFormat } from "./utils";

@Pipe({ name: 'ipfs' })
export class IpfsPipe implements PipeTransform {
  ipfs = inject(IPFS);
  transform(cid: string | CID, format: IpfsFormat = 'txt') {
    const stream = this.ipfs.cat(cid);
    return decodeIpfsTo[format](stream);
  }
}