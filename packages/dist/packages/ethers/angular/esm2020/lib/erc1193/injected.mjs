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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL2VyYzExOTMvaW5qZWN0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7O0FBRy9DLFNBQVMsZ0JBQWdCLENBQUMsUUFBYTtJQUNyQyxJQUFJLFFBQVEsQ0FBQyxVQUFVO1FBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUM7SUFDaEUsSUFBSSxRQUFRLENBQUMsZ0JBQWdCO1FBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUM7SUFDdEUsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQVMsb0JBQW9CO0lBQzNCLE1BQU0sUUFBUSxHQUFJLE1BQWMsQ0FBQyxRQUFRLENBQUM7SUFDMUMsSUFBSSxDQUFDLFFBQVE7UUFBRSxPQUFPLEVBQUUsQ0FBQztJQUN6QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO1FBQ2xFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUNoRDtJQUNELE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBR0QsTUFBTSxPQUFPLGlCQUFrQixTQUFRLE9BQU87SUFHNUM7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQUhWLFlBQU8sR0FBRyxvQkFBb0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBSXJELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFUyxLQUFLLENBQUMsU0FBUztRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1lBQUUsT0FBTztRQUNqQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLHFDQUFxQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3RSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssR0FBRyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLE1BQU07WUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLDZCQUE2QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1RSxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsZUFBZTtZQUFFLE9BQU87UUFDNUMsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTztZQUFFLE9BQU87UUFDcEMsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDOzs4R0ExQlUsaUJBQWlCO2tIQUFqQixpQkFBaUIsY0FESixNQUFNOzJGQUNuQixpQkFBaUI7a0JBRDdCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRVJDMTE5MyB9IGZyb20gJy4vc2VydmljZSc7XG5pbXBvcnQgeyBnZXRBZGRyZXNzIH0gZnJvbSAnQGV0aGVyc3Byb2plY3QvYWRkcmVzcyc7XG5pbXBvcnQgeyB0b0NoYWluSWQgfSBmcm9tICdAbmdldGgvZXRoZXJzLWNvcmUnO1xuaW1wb3J0IHsgRVJDMTE5M1Byb3ZpZGVyLCBXYWxsZXRQcm9maWxlIH0gZnJvbSAnLi90eXBlcyc7XG5cbmZ1bmN0aW9uIHRvSW5qZWN0ZWRXYWxsZXQocHJvdmlkZXI6IGFueSk6IFdhbGxldFByb2ZpbGUge1xuICBpZiAocHJvdmlkZXIuaXNNZXRhTWFzaykgcmV0dXJuIHsgbGFiZWw6ICdNZXRhTWFzaycsIHByb3ZpZGVyIH07XG4gIGlmIChwcm92aWRlci5pc0NvaW5iYXNlV2FsbGV0KSByZXR1cm4geyBsYWJlbDogJ0NvaW5iYXNlJywgcHJvdmlkZXIgfTtcbiAgcmV0dXJuIHsgbGFiZWw6ICdVbmtub3duJywgcHJvdmlkZXIgfTtcbn1cblxuZnVuY3Rpb24gZ2V0SW5qZWN0ZWRQcm92aWRlcnMoKTogRVJDMTE5M1Byb3ZpZGVyW10ge1xuICBjb25zdCBldGhlcmV1bSA9ICh3aW5kb3cgYXMgYW55KS5ldGhlcmV1bTtcbiAgaWYgKCFldGhlcmV1bSkgcmV0dXJuIFtdO1xuICBpZiAoQXJyYXkuaXNBcnJheShldGhlcmV1bS5wcm92aWRlcnMpICYmIGV0aGVyZXVtLnByb3ZpZGVycy5sZW5ndGgpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGV0aGVyZXVtLnByb3ZpZGVycykpO1xuICB9XG4gIHJldHVybiBbZXRoZXJldW1dO1xufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEluamVjdGVkUHJvdmlkZXJzIGV4dGVuZHMgRVJDMTE5MyB7XG4gIHdhbGxldHMgPSBnZXRJbmplY3RlZFByb3ZpZGVycygpLm1hcCh0b0luamVjdGVkV2FsbGV0KTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmICh0aGlzLndhbGxldHMubGVuZ3RoID09PSAxKSB0aGlzLnNlbGVjdFdhbGxldCh0aGlzLndhbGxldHNbMF0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGdldFdhbGxldCgpIHtcbiAgICBpZiAoIXRoaXMud2FsbGV0cy5sZW5ndGgpIHJldHVybjtcbiAgICBpZiAodGhpcy53YWxsZXRzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHRoaXMud2FsbGV0c1swXTtcbiAgICBjb25zdCBsYWJlbHMgPSB0aGlzLndhbGxldHMubWFwKHcgPT4gdy5sYWJlbCk7XG4gICAgY29uc3QgcmVzID0gcHJvbXB0KGBXaGljaCB3YWxsZXQgZG8geW91IHdhbnQgdG8gdXNlID8gJHtsYWJlbHMuam9pbignLCAnKX1gKTtcbiAgICBjb25zdCB3YWxsZXQgPSB0aGlzLndhbGxldHMuZmluZCh3ID0+IHcubGFiZWwudG9Mb3dlckNhc2UoKSA9PT0gcmVzPy50b0xvd2VyQ2FzZSgpKTtcbiAgICBpZiAoIXdhbGxldCkgYWxlcnQoYFwiJHtyZXN9XCIgaXMgbm90IHBhcnQgb2Ygb3B0aW9uczogJHtsYWJlbHMuam9pbignLCAnKX1gKTtcbiAgICByZXR1cm4gd2FsbGV0O1xuICB9XG5cbiAgZ2V0IGFjY291bnQoKSB7XG4gICAgaWYgKCF0aGlzLnByb3ZpZGVyPy5zZWxlY3RlZEFkZHJlc3MpIHJldHVybjtcbiAgICByZXR1cm4gZ2V0QWRkcmVzcyh0aGlzLnByb3ZpZGVyLnNlbGVjdGVkQWRkcmVzcyk7XG4gIH1cblxuICBnZXQgY2hhaW5JZCgpIHtcbiAgICBpZiAoIXRoaXMucHJvdmlkZXI/LmNoYWluSWQpIHJldHVybjtcbiAgICByZXR1cm4gdG9DaGFpbklkKHRoaXMucHJvdmlkZXIuY2hhaW5JZCk7XG4gIH1cbn0iXX0=