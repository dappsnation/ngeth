import { ContractEvents, EthersContract, TypedEvent, TypedFilter } from '@ngeth/ethers-core';
import { ContractInterface } from '@ethersproject/contracts';
import { Observable } from 'rxjs';
import { NgZone } from '@angular/core';
import type { Signer } from '@ethersproject/abstract-signer';
import type { Provider } from "@ethersproject/providers";
export declare class NgContract<Events extends ContractEvents<EventKeys, FilterKeys>, EventKeys extends Extract<keyof Events['events'], string> = Extract<keyof Events['events'], string>, FilterKeys extends Extract<keyof Events['filters'], string> = Extract<keyof Events['filters'], string>> extends EthersContract<Events, EventKeys, FilterKeys> {
    private ngZone;
    private _events;
    constructor(address: string, abi: ContractInterface, signer?: Provider | Signer, ngZone?: NgZone);
    /** Transform event name into an EventFilter */
    private getEventFilter;
    private wrapEvent;
    /**
     * Listen on the changes of an event, starting with the current state
     * @param event The event filter
     */
    from<K extends FilterKeys>(event: TypedFilter<K> | K): Observable<TypedEvent<Events, K>[]>;
}
