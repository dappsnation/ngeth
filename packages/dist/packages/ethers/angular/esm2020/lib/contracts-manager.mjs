import { inject, Injectable, Injector, NgZone } from '@angular/core';
import { Signer } from '@ethersproject/abstract-signer';
import * as i0 from "@angular/core";
export class ContractsManager {
    constructor() {
        this.contracts = {};
        this.injector = inject(Injector);
        this.zone = inject(NgZone);
    }
    get signer() {
        return this.injector.get(Signer);
    }
    get(address, chainId) {
        if (!this.contracts[chainId])
            this.contracts[chainId] = {};
        if (!this.contracts[chainId][address]) {
            this.contracts[chainId][address] = this.createInstance(address);
        }
        return this.contracts[chainId][address];
    }
}
ContractsManager.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ContractsManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ContractsManager.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ContractsManager });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ContractsManager, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3RzLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL2NvbnRyYWN0cy1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdDQUFnQyxDQUFDOztBQUd4RCxNQUFNLE9BQWdCLGdCQUFnQjtJQUR0QztRQUVVLGNBQVMsR0FBc0MsRUFBRSxDQUFDO1FBQ2xELGFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUIsU0FBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQWNqQztJQWJDLElBQWMsTUFBTTtRQUNsQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFJRCxHQUFHLENBQUMsT0FBZSxFQUFFLE9BQWU7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1lBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBTSxDQUFDO0lBQy9DLENBQUM7OzZHQWhCbUIsZ0JBQWdCO2lIQUFoQixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFEckMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTaWduZXIgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9hYnN0cmFjdC1zaWduZXInO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29udHJhY3RzTWFuYWdlcjxUPiB7XHJcbiAgcHJpdmF0ZSBjb250cmFjdHM6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIFQ+PiA9IHt9O1xyXG4gIHByaXZhdGUgaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xyXG4gIHByb3RlY3RlZCB6b25lID0gaW5qZWN0KE5nWm9uZSk7XHJcbiAgcHJvdGVjdGVkIGdldCBzaWduZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbmplY3Rvci5nZXQoU2lnbmVyKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBjcmVhdGVJbnN0YW5jZShhZGRyZXNzOiBzdHJpbmcpOiBUO1xyXG5cclxuICBnZXQoYWRkcmVzczogc3RyaW5nLCBjaGFpbklkOiBudW1iZXIpOiBUIHtcclxuICAgIGlmICghdGhpcy5jb250cmFjdHNbY2hhaW5JZF0pIHRoaXMuY29udHJhY3RzW2NoYWluSWRdID0ge307XHJcbiAgICBpZiAoIXRoaXMuY29udHJhY3RzW2NoYWluSWRdW2FkZHJlc3NdKSB7XHJcbiAgICAgIHRoaXMuY29udHJhY3RzW2NoYWluSWRdW2FkZHJlc3NdID0gdGhpcy5jcmVhdGVJbnN0YW5jZShhZGRyZXNzKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmNvbnRyYWN0c1tjaGFpbklkXVthZGRyZXNzXSBhcyBUO1xyXG4gIH1cclxufSJdfQ==