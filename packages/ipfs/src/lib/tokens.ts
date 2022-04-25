import { inject, InjectFlags, InjectionToken } from "@angular/core";
import { create, Options } from "ipfs-http-client";

export const IPFS_OPTIONS = new InjectionToken<Options>('Options for the IPFS Client');
export type IPFSClient = ReturnType<typeof create>;
export const IPFS = new InjectionToken<IPFSClient>('IPFS Client', {
  providedIn: 'root',
  factory: () => {
    const options = inject(IPFS_OPTIONS, InjectFlags.Optional) ?? { port: 5002 };
    return create(options);
  }
});