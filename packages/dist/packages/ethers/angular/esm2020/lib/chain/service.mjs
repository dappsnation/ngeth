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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2V0aGVycy9hbmd1bGFyL3NyYy9saWIvY2hhaW4vc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3pGLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxLQUFLLEVBQUcsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFFbkQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLElBQUksY0FBYyxDQUF3QiwwRUFBMEUsRUFBRTtJQUNqSixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsbUJBQW1CO0NBQ25DLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLElBQUksY0FBYyxDQUFrQiwwQkFBMEIsRUFBRTtJQUM5RixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRztDQUNuQixDQUFDLENBQUM7QUFFSCxTQUFTLEtBQUssQ0FBSSxLQUFnQjtJQUNoQyxPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQztBQUMvQyxDQUFDO0FBRUQsTUFBTSxVQUFVLFFBQVEsQ0FBQyxPQUF3QjtJQUMvQyxNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMs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QUFFLE1BQTRCO1FBQ3RELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNyRDtRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFjLEVBQUUsT0FBaUI7UUFDN0MsT0FBTyxHQUFHLE9BQU8sSUFBSSxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsT0FBTztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNyRCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7O3lHQS9DVSxZQUFZLDBDQWNiLGFBQWE7NkdBZFosWUFBWSxjQURDLE1BQU07MkZBQ25CLFlBQVk7a0JBRHhCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzswQkFlN0IsTUFBTTsyQkFBQyxhQUFhOzswQkFDcEIsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHR5cGUgeyBDaGFpbkljb24sIENoYWluLCBTdXBwb3J0ZWRDaGFpbnMsIENoYWluSWQgfSBmcm9tIFwiQG5nZXRoL2V0aGVycy1jb3JlXCI7XHJcbmltcG9ydCB7IGV4cGxvcmUsIHRvQ2hhaW5JZCwgZGVmYXVsdEN1c3RvbUNoYWlucywgdG9DaGFpbkhleCB9IGZyb20gXCJAbmdldGgvZXRoZXJzLWNvcmVcIjtcclxuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9wcm92aWRlcnMnO1xyXG5pbXBvcnQgeyBFUkMxMTkzIH0gZnJvbSBcIi4uL2VyYzExOTNcIjtcclxuaW1wb3J0IHsgZGVmZXIsICBmcm9tIH0gZnJvbSBcInJ4anNcIjtcclxuaW1wb3J0IHsgZmlsdGVyLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgQ1VTVE9NX0NIQUlOUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSZWNvcmQ8c3RyaW5nLCBDaGFpbj4+KCdDdXN0b20gQ2hhaW5zIHRvIHVzZSBpbnN0ZWFkIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9ldGhlcmV1bS1saXN0cy9jaGFpbnMnLCB7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxyXG4gIGZhY3Rvcnk6ICgpID0+IGRlZmF1bHRDdXN0b21DaGFpbnNcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgU1VQUE9SVEVEX0NIQUlOUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTdXBwb3J0ZWRDaGFpbnM+KCdMaXN0IG9mIHN1cHBvcnRlZCBjaGFpbnMnLCB7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxyXG4gIGZhY3Rvcnk6ICgpID0+ICcqJ1xyXG59KTtcclxuXHJcbmZ1bmN0aW9uIGV4aXN0PFQ+KHZhbHVlPzogVCB8IG51bGwpOiB2YWx1ZSBpcyBUIHtcclxuICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYWluKGNoYWluSWQ6IHN0cmluZyB8IG51bWJlcik6IFByb21pc2U8Q2hhaW4+IHtcclxuICBjb25zdCBpZCA9IHRvQ2hhaW5JZChjaGFpbklkKTsgLy8gdHJhbnNmb3JtIGludG8gZGVjaW1hbHNcclxuICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2V0aGVyZXVtLWxpc3RzL2NoYWlucy9tYXN0ZXIvX2RhdGEvY2hhaW5zL2VpcDE1NS0ke2lkfS5qc29uYDtcclxuICByZXR1cm4gZmV0Y2godXJsKS50aGVuKHJlcyA9PiByZXMuanNvbigpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYWluSWNvbnMobmFtZTogc3RyaW5nLCBmb3JtYXQ/OiBDaGFpbkljb25bJ2Zvcm1hdCddKTogUHJvbWlzZTxDaGFpbkljb24+IHtcclxuICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9naXRodWIuY29tL2V0aGVyZXVtLWxpc3RzL2NoYWlucy9ibG9iL21hc3Rlci9fZGF0YS9pY29ucy8ke25hbWV9Lmpzb25gO1xyXG4gIHJldHVybiBmZXRjaCh1cmwpXHJcbiAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgIC50aGVuKChpY29uczogQ2hhaW5JY29uW10pID0+IHtcclxuICAgICAgaWYgKCFmb3JtYXQpIHJldHVybiBpY29uc1swXTtcclxuICAgICAgcmV0dXJuIGljb25zLmZpbmQoaWNvbiA9PiBpY29uLmZvcm1hdCA9PT0gZm9ybWF0KSA/PyBpY29uc1swXTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgQ2hhaW5NYW5hZ2VyIHtcclxuICBwcml2YXRlIGNoYWluczogUmVjb3JkPHN0cmluZywgQ2hhaW4+ID0ge307XHJcbiAgcHJpdmF0ZSBpY29uczogUmVjb3JkPHN0cmluZywgQ2hhaW5JY29uPiA9IHt9O1xyXG5cclxuICBjaGFpbiQgPSBkZWZlcigoKSA9PiB7XHJcbiAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmVyYzExOTMgPyB0aGlzLmVyYzExOTMuY2hhaW5JZCQgOiBmcm9tKHRoaXMuY3VycmVudENoYWluKCkpO1xyXG4gICAgcmV0dXJuIHNvdXJjZTtcclxuICB9KS5waXBlKFxyXG4gICAgZmlsdGVyKGV4aXN0KSxcclxuICAgIHN3aXRjaE1hcChjaGFpbklkID0+IHRoaXMuZ2V0Q2hhaW4oY2hhaW5JZCkpLFxyXG4gIClcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHByb3ZpZGVyOiBQcm92aWRlcixcclxuICAgIEBJbmplY3QoQ1VTVE9NX0NIQUlOUykgcHJpdmF0ZSBjdXN0b21DaGFpbnM6IFJlY29yZDxzdHJpbmcsIENoYWluPixcclxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZXJjMTE5Mz86IEVSQzExOTMsXHJcbiAgKSB7fVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGN1cnJlbnRDaGFpbigpIHtcclxuICAgIGlmICh0aGlzLmVyYzExOTMpIHJldHVybiB0aGlzLmVyYzExOTMuY2hhaW5JZDtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLmdldE5ldHdvcmsoKS50aGVuKG5ldHdvcmsgPT4gbmV0d29yay5jaGFpbklkKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGdldENoYWluKGNoYWluSWQ/OiBDaGFpbklkKTogUHJvbWlzZTxDaGFpbj4ge1xyXG4gICAgY2hhaW5JZCA9IGNoYWluSWQgPz8gYXdhaXQgdGhpcy5jdXJyZW50Q2hhaW4oKTtcclxuICAgIGlmICghY2hhaW5JZCkgdGhyb3cgbmV3IEVycm9yKCdObyBjaGFpbklkIHByb3ZpZGVkJyk7XHJcbiAgICBjb25zdCBpZCA9IHRvQ2hhaW5IZXgoY2hhaW5JZCk7XHJcbiAgICBpZiAoaWQgaW4gdGhpcy5jdXN0b21DaGFpbnMpIHJldHVybiB0aGlzLmN1c3RvbUNoYWluc1tpZF07XHJcbiAgICBpZiAoIXRoaXMuY2hhaW5zW2lkXSkge1xyXG4gICAgICB0aGlzLmNoYWluc1tpZF0gPSBhd2FpdCBnZXRDaGFpbihpZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFpbnNbaWRdO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0SWNvbihuYW1lOiBzdHJpbmcsIGZvcm1hdD86IENoYWluSWNvblsnZm9ybWF0J10pIHtcclxuICAgIGNvbnN0IGtleSA9IGZvcm1hdCA/IGAke25hbWV9XyR7Zm9ybWF0fWAgOiBuYW1lO1xyXG4gICAgaWYgKCF0aGlzLmljb25zW2tleV0pIHtcclxuICAgICAgdGhpcy5pY29uc1trZXldID0gYXdhaXQgZ2V0Q2hhaW5JY29ucyhuYW1lLCBmb3JtYXQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuaWNvbnNba2V5XTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGV4cGxvcmUoc2VhcmNoOiBzdHJpbmcsIGNoYWluSWQ/OiBDaGFpbklkKSB7XHJcbiAgICBjaGFpbklkID0gY2hhaW5JZCA/PyBhd2FpdCB0aGlzLmN1cnJlbnRDaGFpbigpO1xyXG4gICAgaWYgKCFjaGFpbklkKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGNoYWluSWQgcHJvdmlkZWQnKTtcclxuICAgIGNvbnN0IGNoYWluID0gYXdhaXQgdGhpcy5nZXRDaGFpbihjaGFpbklkKTtcclxuICAgIHJldHVybiBleHBsb3JlKGNoYWluLCBzZWFyY2gpO1xyXG4gIH1cclxufSJdfQ==