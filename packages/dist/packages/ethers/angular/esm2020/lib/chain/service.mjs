import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { explore, toChainId, defaultCustomChains, toChainHex } from "@ngeth/ethers-core";
import { Provider } from '@ethersproject/providers';
import { ERC1193 } from "../erc1193";
import { defer, from } from "rxjs";
import { filter, switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@ethersproject/providers";
import * as i2 from "../erc1193";
export const CUSTOM_CHAINS = new InjectionToken('Custom Chains to use instead of https://github.com/ethereum-lists/chains', {
    providedIn: 'root',
    factory: () => defaultCustomChains
});
export const SUPPORTED_CHAINS = new InjectionToken('List of supported chains', {
    providedIn: 'root',
    factory: () => '*'
});
function exist(value) {
    return value !== undefined && value !== null;
}
export function getChain(chainId) {
    const id = toChainId(chainId); // transform into decimals
    const url = `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${id}.json`;
    return fetch(url).then(res => res.json());
}
export function getChainIcons(name, format) {
    const url = `https://github.com/ethereum-lists/chains/blob/master/_data/icons/${name}.json`;
    return fetch(url)
        .then(res => res.json())
        .then((icons) => {
        if (!format)
            return icons[0];
        return icons.find(icon => icon.format === format) ?? icons[0];
    });
}
export class ChainManager {
    constructor(provider, customChains, erc1193) {
        this.provider = provider;
        this.customChains = customChains;
        this.erc1193 = erc1193;
        this.chains = {};
        this.icons = {};
        this.chain$ = defer(() => {
            const source = this.erc1193 ? this.erc1193.chainId$ : from(this.currentChain());
            return source;
        }).pipe(filter(exist), switchMap(chainId => this.getChain(chainId)));
    }
    async currentChain() {
        if (this.erc1193)
            return this.erc1193.chainId;
        return this.provider.getNetwork().then(network => network.chainId);
    }
    async getChain(chainId) {
        chainId = chainId ?? await this.currentChain();
        if (!chainId)
            throw new Error('No chainId provided');
        const id = toChainHex(chainId);
        if (id in this.customChains)
            return this.customChains[id];
        if (!this.chains[id]) {
            this.chains[id] = await getChain(id);
        }
        return this.chains[id];
    }
    async getIcon(name, format) {
        const key = format ? `${name}_${format}` : name;
        if (!this.icons[key]) {
            this.icons[key] = await getChainIcons(name, format);
        }
        return this.icons[key];
    }
    async explore(search, chainId) {
        chainId = chainId ?? await this.currentChain();
        if (!chainId)
            throw new Error('No chainId provided');
        const chain = await this.getChain(chainId);
        return explore(chain, search);
    }
}
ChainManager.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChainManager, deps: [{ token: i1.Provider }, { token: CUSTOM_CHAINS }, { token: i2.ERC1193, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ChainManager.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChainManager, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChainManager, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Provider }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CUSTOM_CHAINS]
                }] }, { type: i2.ERC1193, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2V0aGVycy9hbmd1bGFyL3NyYy9saWIvY2hhaW4vc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3pGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxLQUFLLEVBQUcsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFFbkQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLElBQUksY0FBYyxDQUF3QiwwRUFBMEUsRUFBRTtJQUNqSixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsbUJBQW1CO0NBQ25DLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLElBQUksY0FBYyxDQUFrQiwwQkFBMEIsRUFBRTtJQUM5RixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRztDQUNuQixDQUFDLENBQUM7QUFFSCxTQUFTLEtBQUssQ0FBSSxLQUFnQjtJQUNoQyxPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQztBQUMvQyxDQUFDO0FBRUQsTUFBTSxVQUFVLFFBQVEsQ0FBQyxPQUF3QjtJQUMvQyxNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMs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QUFFLE1BQTRCO1FBQ3RELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNyRDtRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFjLEVBQUUsT0FBaUI7UUFDN0MsT0FBTyxHQUFHLE9BQU8sSUFBSSxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsT0FBTztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNyRCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7O3lHQS9DVSxZQUFZLDBDQWNiLGFBQWE7NkdBZFosWUFBWSxjQURDLE1BQU07MkZBQ25CLFlBQVk7a0JBRHhCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzswQkFlN0IsTUFBTTsyQkFBQyxhQUFhOzswQkFDcEIsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB0eXBlIHsgQ2hhaW5JY29uLCBDaGFpbiwgU3VwcG9ydGVkQ2hhaW5zLCBDaGFpbklkIH0gZnJvbSBcIkBuZ2V0aC9ldGhlcnMtY29yZVwiO1xuaW1wb3J0IHsgZXhwbG9yZSwgdG9DaGFpbklkLCBkZWZhdWx0Q3VzdG9tQ2hhaW5zLCB0b0NoYWluSGV4IH0gZnJvbSBcIkBuZ2V0aC9ldGhlcnMtY29yZVwiO1xuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9wcm92aWRlcnMnO1xuaW1wb3J0IHsgRVJDMTE5MyB9IGZyb20gXCIuLi9lcmMxMTkzXCI7XG5pbXBvcnQgeyBkZWZlciwgIGZyb20gfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgZmlsdGVyLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBjb25zdCBDVVNUT01fQ0hBSU5TID0gbmV3IEluamVjdGlvblRva2VuPFJlY29yZDxzdHJpbmcsIENoYWluPj4oJ0N1c3RvbSBDaGFpbnMgdG8gdXNlIGluc3RlYWQgb2YgaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtLWxpc3RzL2NoYWlucycsIHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICBmYWN0b3J5OiAoKSA9PiBkZWZhdWx0Q3VzdG9tQ2hhaW5zXG59KTtcblxuZXhwb3J0IGNvbnN0IFNVUFBPUlRFRF9DSEFJTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48U3VwcG9ydGVkQ2hhaW5zPignTGlzdCBvZiBzdXBwb3J0ZWQgY2hhaW5zJywge1xuICBwcm92aWRlZEluOiAncm9vdCcsXG4gIGZhY3Rvcnk6ICgpID0+ICcqJ1xufSk7XG5cbmZ1bmN0aW9uIGV4aXN0PFQ+KHZhbHVlPzogVCB8IG51bGwpOiB2YWx1ZSBpcyBUIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFpbihjaGFpbklkOiBzdHJpbmcgfCBudW1iZXIpOiBQcm9taXNlPENoYWluPiB7XG4gIGNvbnN0IGlkID0gdG9DaGFpbklkKGNoYWluSWQpOyAvLyB0cmFuc2Zvcm0gaW50byBkZWNpbWFsc1xuICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2V0aGVyZXVtLWxpc3RzL2NoYWlucy9tYXN0ZXIvX2RhdGEvY2hhaW5zL2VpcDE1NS0ke2lkfS5qc29uYDtcbiAgcmV0dXJuIGZldGNoKHVybCkudGhlbihyZXMgPT4gcmVzLmpzb24oKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFpbkljb25zKG5hbWU6IHN0cmluZywgZm9ybWF0PzogQ2hhaW5JY29uWydmb3JtYXQnXSk6IFByb21pc2U8Q2hhaW5JY29uPiB7XG4gIGNvbnN0IHVybCA9IGBodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW0tbGlzdHMvY2hhaW5zL2Jsb2IvbWFzdGVyL19kYXRhL2ljb25zLyR7bmFtZX0uanNvbmA7XG4gIHJldHVybiBmZXRjaCh1cmwpXG4gICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgLnRoZW4oKGljb25zOiBDaGFpbkljb25bXSkgPT4ge1xuICAgICAgaWYgKCFmb3JtYXQpIHJldHVybiBpY29uc1swXTtcbiAgICAgIHJldHVybiBpY29ucy5maW5kKGljb24gPT4gaWNvbi5mb3JtYXQgPT09IGZvcm1hdCkgPz8gaWNvbnNbMF07XG4gICAgfSk7XG59XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgQ2hhaW5NYW5hZ2VyIHtcbiAgcHJpdmF0ZSBjaGFpbnM6IFJlY29yZDxzdHJpbmcsIENoYWluPiA9IHt9O1xuICBwcml2YXRlIGljb25zOiBSZWNvcmQ8c3RyaW5nLCBDaGFpbkljb24+ID0ge307XG5cbiAgY2hhaW4kID0gZGVmZXIoKCkgPT4ge1xuICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuZXJjMTE5MyA/IHRoaXMuZXJjMTE5My5jaGFpbklkJCA6IGZyb20odGhpcy5jdXJyZW50Q2hhaW4oKSk7XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfSkucGlwZShcbiAgICBmaWx0ZXIoZXhpc3QpLFxuICAgIHN3aXRjaE1hcChjaGFpbklkID0+IHRoaXMuZ2V0Q2hhaW4oY2hhaW5JZCkpLFxuICApXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwcm92aWRlcjogUHJvdmlkZXIsXG4gICAgQEluamVjdChDVVNUT01fQ0hBSU5TKSBwcml2YXRlIGN1c3RvbUNoYWluczogUmVjb3JkPHN0cmluZywgQ2hhaW4+LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZXJjMTE5Mz86IEVSQzExOTMsXG4gICkge31cblxuICBwcml2YXRlIGFzeW5jIGN1cnJlbnRDaGFpbigpIHtcbiAgICBpZiAodGhpcy5lcmMxMTkzKSByZXR1cm4gdGhpcy5lcmMxMTkzLmNoYWluSWQ7XG4gICAgcmV0dXJuIHRoaXMucHJvdmlkZXIuZ2V0TmV0d29yaygpLnRoZW4obmV0d29yayA9PiBuZXR3b3JrLmNoYWluSWQpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hhaW4oY2hhaW5JZD86IENoYWluSWQpOiBQcm9taXNlPENoYWluPiB7XG4gICAgY2hhaW5JZCA9IGNoYWluSWQgPz8gYXdhaXQgdGhpcy5jdXJyZW50Q2hhaW4oKTtcbiAgICBpZiAoIWNoYWluSWQpIHRocm93IG5ldyBFcnJvcignTm8gY2hhaW5JZCBwcm92aWRlZCcpO1xuICAgIGNvbnN0IGlkID0gdG9DaGFpbkhleChjaGFpbklkKTtcbiAgICBpZiAoaWQgaW4gdGhpcy5jdXN0b21DaGFpbnMpIHJldHVybiB0aGlzLmN1c3RvbUNoYWluc1tpZF07XG4gICAgaWYgKCF0aGlzLmNoYWluc1tpZF0pIHtcbiAgICAgIHRoaXMuY2hhaW5zW2lkXSA9IGF3YWl0IGdldENoYWluKGlkKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY2hhaW5zW2lkXTtcbiAgfVxuXG4gIGFzeW5jIGdldEljb24obmFtZTogc3RyaW5nLCBmb3JtYXQ/OiBDaGFpbkljb25bJ2Zvcm1hdCddKSB7XG4gICAgY29uc3Qga2V5ID0gZm9ybWF0ID8gYCR7bmFtZX1fJHtmb3JtYXR9YCA6IG5hbWU7XG4gICAgaWYgKCF0aGlzLmljb25zW2tleV0pIHtcbiAgICAgIHRoaXMuaWNvbnNba2V5XSA9IGF3YWl0IGdldENoYWluSWNvbnMobmFtZSwgZm9ybWF0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaWNvbnNba2V5XTtcbiAgfVxuXG4gIGFzeW5jIGV4cGxvcmUoc2VhcmNoOiBzdHJpbmcsIGNoYWluSWQ/OiBDaGFpbklkKSB7XG4gICAgY2hhaW5JZCA9IGNoYWluSWQgPz8gYXdhaXQgdGhpcy5jdXJyZW50Q2hhaW4oKTtcbiAgICBpZiAoIWNoYWluSWQpIHRocm93IG5ldyBFcnJvcignTm8gY2hhaW5JZCBwcm92aWRlZCcpO1xuICAgIGNvbnN0IGNoYWluID0gYXdhaXQgdGhpcy5nZXRDaGFpbihjaGFpbklkKTtcbiAgICByZXR1cm4gZXhwbG9yZShjaGFpbiwgc2VhcmNoKTtcbiAgfVxufSJdfQ==