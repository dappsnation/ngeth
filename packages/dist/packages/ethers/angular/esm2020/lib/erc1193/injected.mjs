import { Injectable } from '@angular/core';
import { ERC1193 } from './service';
import { getAddress } from '@ethersproject/address';
import { toChainId } from '@ngeth/ethers-core';
import * as i0 from "@angular/core";
function toInjectedWallet(provider) {
    if (provider.isMetaMask)
        return { label: 'MetaMask', provider };
    if (provider.isCoinbaseWallet)
        return { label: 'Coinbase', provider };
    return { label: 'Unknown', provider };
}
function getInjectedProviders() {
    const ethereum = window.ethereum;
    if (!ethereum)
        return [];
    if (Array.isArray(ethereum.providers) && ethereum.providers.length) {
        return Array.from(new Set(ethereum.providers));
    }
    return [ethereum];
}
export class InjectedProviders extends ERC1193 {
    constructor() {
        super();
        this.wallets = getInjectedProviders().map(toInjectedWallet);
        if (this.wallets.length === 1)
            this.selectWallet(this.wallets[0]);
    }
    async getWallet() {
        if (!this.wallets.length)
            return;
        if (this.wallets.length === 1)
            return this.wallets[0];
        const labels = this.wallets.map(w => w.label);
        const res = prompt(`Which wallet do you want to use ? ${labels.join(', ')}`);
        const wallet = this.wallets.find(w => w.label.toLowerCase() === res?.toLowerCase());
        if (!wallet)
            alert(`"${res}" is not part of options: ${labels.join(', ')}`);
        return wallet;
    }
    get account() {
        if (!this.provider?.selectedAddress)
            return;
        return getAddress(this.provider.selectedAddress);
    }
    get chainId() {
        if (!this.provider?.chainId)
            return;
        return toChainId(this.provider.chainId);
    }
}
InjectedProviders.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: InjectedProviders, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
InjectedProviders.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: InjectedProviders, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: InjectedProviders, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL2VyYzExOTMvaW5qZWN0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7O0FBRy9DLFNBQVMsZ0JBQWdCLENBQUMsUUFBYTtJQUNyQyxJQUFJLFFBQVEsQ0FBQyxVQUFVO1FBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUM7SUFDaEUsSUFBSSxRQUFRLENBQUMsZ0JBQWdCO1FBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUM7SUFDdEUsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQVMsb0JBQW9CO0lBQzNCLE1BQU0sUUFBUSxHQUFJLE1BQWMsQ0FBQyxRQUFRLENBQUM7SUFDMUMsSUFBSSxDQUFDLFFBQVE7UUFBRSxPQUFPLEVBQUUsQ0FBQztJQUN6QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO1FBQ2xFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUNoRDtJQUNELE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBR0QsTUFBTSxPQUFPLGlCQUFrQixTQUFRLE9BQU87SUFHNUM7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQUhWLFlBQU8sR0FBRyxvQkFBb0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBSXJELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFUyxLQUFLLENBQUMsU0FBUztRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1lBQUUsT0FBTztRQUNqQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLHFDQUFxQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3RSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssR0FBRyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLE1BQU07WUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLDZCQUE2QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1RSxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsZUFBZTtZQUFFLE9BQU87UUFDNUMsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTztZQUFFLE9BQU87UUFDcEMsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDOzs4R0ExQlUsaUJBQWlCO2tIQUFqQixpQkFBaUIsY0FESixNQUFNOzJGQUNuQixpQkFBaUI7a0JBRDdCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBFUkMxMTkzIH0gZnJvbSAnLi9zZXJ2aWNlJztcclxuaW1wb3J0IHsgZ2V0QWRkcmVzcyB9IGZyb20gJ0BldGhlcnNwcm9qZWN0L2FkZHJlc3MnO1xyXG5pbXBvcnQgeyB0b0NoYWluSWQgfSBmcm9tICdAbmdldGgvZXRoZXJzLWNvcmUnO1xyXG5pbXBvcnQgeyBFUkMxMTkzUHJvdmlkZXIsIFdhbGxldFByb2ZpbGUgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbmZ1bmN0aW9uIHRvSW5qZWN0ZWRXYWxsZXQocHJvdmlkZXI6IGFueSk6IFdhbGxldFByb2ZpbGUge1xyXG4gIGlmIChwcm92aWRlci5pc01ldGFNYXNrKSByZXR1cm4geyBsYWJlbDogJ01ldGFNYXNrJywgcHJvdmlkZXIgfTtcclxuICBpZiAocHJvdmlkZXIuaXNDb2luYmFzZVdhbGxldCkgcmV0dXJuIHsgbGFiZWw6ICdDb2luYmFzZScsIHByb3ZpZGVyIH07XHJcbiAgcmV0dXJuIHsgbGFiZWw6ICdVbmtub3duJywgcHJvdmlkZXIgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW5qZWN0ZWRQcm92aWRlcnMoKTogRVJDMTE5M1Byb3ZpZGVyW10ge1xyXG4gIGNvbnN0IGV0aGVyZXVtID0gKHdpbmRvdyBhcyBhbnkpLmV0aGVyZXVtO1xyXG4gIGlmICghZXRoZXJldW0pIHJldHVybiBbXTtcclxuICBpZiAoQXJyYXkuaXNBcnJheShldGhlcmV1bS5wcm92aWRlcnMpICYmIGV0aGVyZXVtLnByb3ZpZGVycy5sZW5ndGgpIHtcclxuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoZXRoZXJldW0ucHJvdmlkZXJzKSk7XHJcbiAgfVxyXG4gIHJldHVybiBbZXRoZXJldW1dO1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgSW5qZWN0ZWRQcm92aWRlcnMgZXh0ZW5kcyBFUkMxMTkzIHtcclxuICB3YWxsZXRzID0gZ2V0SW5qZWN0ZWRQcm92aWRlcnMoKS5tYXAodG9JbmplY3RlZFdhbGxldCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIGlmICh0aGlzLndhbGxldHMubGVuZ3RoID09PSAxKSB0aGlzLnNlbGVjdFdhbGxldCh0aGlzLndhbGxldHNbMF0pO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGFzeW5jIGdldFdhbGxldCgpIHtcclxuICAgIGlmICghdGhpcy53YWxsZXRzLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgaWYgKHRoaXMud2FsbGV0cy5sZW5ndGggPT09IDEpIHJldHVybiB0aGlzLndhbGxldHNbMF07XHJcbiAgICBjb25zdCBsYWJlbHMgPSB0aGlzLndhbGxldHMubWFwKHcgPT4gdy5sYWJlbCk7XHJcbiAgICBjb25zdCByZXMgPSBwcm9tcHQoYFdoaWNoIHdhbGxldCBkbyB5b3Ugd2FudCB0byB1c2UgPyAke2xhYmVscy5qb2luKCcsICcpfWApO1xyXG4gICAgY29uc3Qgd2FsbGV0ID0gdGhpcy53YWxsZXRzLmZpbmQodyA9PiB3LmxhYmVsLnRvTG93ZXJDYXNlKCkgPT09IHJlcz8udG9Mb3dlckNhc2UoKSk7XHJcbiAgICBpZiAoIXdhbGxldCkgYWxlcnQoYFwiJHtyZXN9XCIgaXMgbm90IHBhcnQgb2Ygb3B0aW9uczogJHtsYWJlbHMuam9pbignLCAnKX1gKTtcclxuICAgIHJldHVybiB3YWxsZXQ7XHJcbiAgfVxyXG5cclxuICBnZXQgYWNjb3VudCgpIHtcclxuICAgIGlmICghdGhpcy5wcm92aWRlcj8uc2VsZWN0ZWRBZGRyZXNzKSByZXR1cm47XHJcbiAgICByZXR1cm4gZ2V0QWRkcmVzcyh0aGlzLnByb3ZpZGVyLnNlbGVjdGVkQWRkcmVzcyk7XHJcbiAgfVxyXG5cclxuICBnZXQgY2hhaW5JZCgpIHtcclxuICAgIGlmICghdGhpcy5wcm92aWRlcj8uY2hhaW5JZCkgcmV0dXJuO1xyXG4gICAgcmV0dXJuIHRvQ2hhaW5JZCh0aGlzLnByb3ZpZGVyLmNoYWluSWQpO1xyXG4gIH1cclxufSJdfQ==