import { NgZone } from "@angular/core";
import { Provider, EventFilter } from "@ethersproject/abstract-provider";
import { Observable } from "rxjs";
import { ERC1193Provider } from "./erc1193";
export declare function fromEthEvent<T>(provider: Provider | ERC1193Provider, zone: NgZone, event: string | EventFilter, initial?: Partial<T>): Observable<T>;
