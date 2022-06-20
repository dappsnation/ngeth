import { NgZone } from "@angular/core";
import { Provider, EventFilter } from "@ethersproject/abstract-provider";
import { Observable } from "rxjs";
import { NgERC1193Provider } from "./erc1193";

export function fromEthEvent<T>(
  provider: Provider | NgERC1193Provider,
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