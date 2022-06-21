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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3RzLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL2NvbnRyYWN0cy1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdDQUFnQyxDQUFDOztBQUd4RCxNQUFNLE9BQWdCLGdCQUFnQjtJQUR0QztRQUVVLGNBQVMsR0FBc0MsRUFBRSxDQUFDO1FBQ2xELGFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUIsU0FBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQWNqQztJQWJDLElBQWMsTUFBTTtRQUNsQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFJRCxHQUFHLENBQUMsT0FBZSxFQUFFLE9BQWU7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1lBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBTSxDQUFDO0lBQy9DLENBQUM7OzZHQWhCbUIsZ0JBQWdCO2lIQUFoQixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFEckMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2lnbmVyIH0gZnJvbSAnQGV0aGVyc3Byb2plY3QvYWJzdHJhY3Qtc2lnbmVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbnRyYWN0c01hbmFnZXI8VD4ge1xuICBwcml2YXRlIGNvbnRyYWN0czogUmVjb3JkPHN0cmluZywgUmVjb3JkPHN0cmluZywgVD4+ID0ge307XG4gIHByaXZhdGUgaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuICBwcm90ZWN0ZWQgem9uZSA9IGluamVjdChOZ1pvbmUpO1xuICBwcm90ZWN0ZWQgZ2V0IHNpZ25lcigpIHtcbiAgICByZXR1cm4gdGhpcy5pbmplY3Rvci5nZXQoU2lnbmVyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBjcmVhdGVJbnN0YW5jZShhZGRyZXNzOiBzdHJpbmcpOiBUO1xuXG4gIGdldChhZGRyZXNzOiBzdHJpbmcsIGNoYWluSWQ6IG51bWJlcik6IFQge1xuICAgIGlmICghdGhpcy5jb250cmFjdHNbY2hhaW5JZF0pIHRoaXMuY29udHJhY3RzW2NoYWluSWRdID0ge307XG4gICAgaWYgKCF0aGlzLmNvbnRyYWN0c1tjaGFpbklkXVthZGRyZXNzXSkge1xuICAgICAgdGhpcy5jb250cmFjdHNbY2hhaW5JZF1bYWRkcmVzc10gPSB0aGlzLmNyZWF0ZUluc3RhbmNlKGFkZHJlc3MpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb250cmFjdHNbY2hhaW5JZF1bYWRkcmVzc10gYXMgVDtcbiAgfVxufSJdfQ==