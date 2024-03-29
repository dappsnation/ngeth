import { NgZone } from "@angular/core";
import { Provider, EventFilter } from "@ethersproject/abstract-provider";
import { ERC1193Provider } from "@ngeth/ethers-core";
import { Observable } from "rxjs";

export function fromEthEvent<T>(
  provider: Provider | ERC1193Provider,
  zone: NgZone,
  event: string | EventFilter,
  initial?: Partial<T>
) {
  return new Observable<T>((subscriber) => {
    if (arguments.length === 4) zone.run(() => subscriber.next(initial as any));
    const handler = (...args: any[]) => {
      zone.run(() => subscriber.next(1 < args.length ? args : args[0]));
    };
    provider.addListener(event as any, handler);
    return () => provider.removeListener(event as any, handler);
  });
}