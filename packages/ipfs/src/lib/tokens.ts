import { InjectionToken } from "@angular/core";
import { create } from "ipfs-http-client";

export type IPFSClient = ReturnType<typeof create>;
export const IPFS = new InjectionToken<IPFSClient>('', {
  providedIn: 'root',
  factory: () => create({ port: 5002 })
});