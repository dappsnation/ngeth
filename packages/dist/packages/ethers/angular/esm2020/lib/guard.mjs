import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { toChainId } from '@ngeth/ethers-core';
import { map, tap } from "rxjs";
import { SUPPORTED_CHAINS } from "./chain";
import { ERC1193 } from "./erc1193";
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "./erc1193";
export class HasInjectedProviderGuard {
    constructor(router) {
        this.router = router;
    }
    canActivate(route, state) {
        if ('ethereum' in window)
            return true;
        this.previous = state.url;
        const redirect = route.data['hasInjectedProviderRedirect'] ?? '/no-injected-provider';
        // Navigate to avoid next guard to run
        return this.router.navigate([redirect]);
    }
}
HasInjectedProviderGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasInjectedProviderGuard, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
HasInjectedProviderGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasInjectedProviderGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasInjectedProviderGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Router }]; } });
export class HasWalletGuard {
    constructor(erc1193, router) {
        this.erc1193 = erc1193;
        this.router = router;
    }
    canActivate(route, state) {
        if (this.erc1193.wallets.length)
            return true;
        this.previous = state.url;
        const redirect = route.data['hasWalletRedirect'] ?? '/no-wallet';
        // Navigate to avoid next guard to run
        return this.router.navigate([redirect]);
    }
}
HasWalletGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasWalletGuard, deps: [{ token: i2.ERC1193 }, { token: i1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
HasWalletGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasWalletGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasWalletGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i2.ERC1193 }, { type: i1.Router }]; } });
export class IsSupportedChainGuard {
    constructor(router, erc1193, supportedChains) {
        this.router = router;
        this.erc1193 = erc1193;
        this.supportedChains = supportedChains;
    }
    canActivate(route, state) {
        this.previous = state.url;
        if (this.supportedChains === '*')
            return true;
        if (!this.erc1193.chainId)
            return false;
        const chainIndex = toChainId(this.erc1193.chainId);
        if (this.supportedChains.includes(chainIndex))
            return true;
        const redirect = route.data['isSupportedChainRedirect'] ?? '/unsupported-chain';
        return this.router.navigate([redirect]);
    }
}
IsSupportedChainGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsSupportedChainGuard, deps: [{ token: i1.Router }, { token: i2.ERC1193 }, { token: SUPPORTED_CHAINS }], target: i0.ɵɵFactoryTarget.Injectable });
IsSupportedChainGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsSupportedChainGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsSupportedChainGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Router }, { type: i2.ERC1193 }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SUPPORTED_CHAINS]
                }] }]; } });
export class IsConnectedGuard {
    constructor(router, erc1193) {
        this.router = router;
        this.erc1193 = erc1193;
    }
    canActivate(route, state) {
        this.previous = state.url;
        const redirect = route.data['isConnectedRedirect'] ?? '/not-connected';
        return this.erc1193.connected$.pipe(map(isConnected => isConnected || this.router.parseUrl(redirect)));
    }
}
IsConnectedGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsConnectedGuard, deps: [{ token: i1.Router }, { token: i2.ERC1193 }], target: i0.ɵɵFactoryTarget.Injectable });
IsConnectedGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsConnectedGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsConnectedGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Router }, { type: i2.ERC1193 }]; } });
export class HasSignerGuard {
    constructor(router, erc1193) {
        this.router = router;
        this.erc1193 = erc1193;
    }
    canActivate(route, state) {
        this.previous = state.url;
        const redirect = route.data['hasSignerRedirect'] ?? '/no-signer';
        return this.erc1193.account$.pipe(tap(console.log), map(account => !!account || this.router.parseUrl(redirect)));
    }
}
HasSignerGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasSignerGuard, deps: [{ token: i1.Router }, { token: i2.ERC1193 }], target: i0.ɵɵFactoryTarget.Injectable });
HasSignerGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasSignerGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasSignerGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Router }, { type: i2.ERC1193 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL2d1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBdUMsTUFBTSxFQUF1QixNQUFNLGlCQUFpQixDQUFDO0FBQ25HLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNoQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQzs7OztBQUdwQyxNQUFNLE9BQU8sd0JBQXdCO0lBR25DLFlBQW9CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUcsQ0FBQztJQUV0QyxXQUFXLENBQUMsS0FBNkIsRUFBRSxLQUEwQjtRQUNuRSxJQUFJLFVBQVUsSUFBSSxNQUFNO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsSUFBSSx1QkFBdUIsQ0FBQztRQUN0RixzQ0FBc0M7UUFDdEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7cUhBWFUsd0JBQXdCO3lIQUF4Qix3QkFBd0IsY0FEWCxNQUFNOzJGQUNuQix3QkFBd0I7a0JBRHBDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOztBQWdCbEMsTUFBTSxPQUFPLGNBQWM7SUFHekIsWUFBb0Is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QURoQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUN2QixDQUFDO0lBRUosV0FBVyxDQUFDLEtBQTZCLEVBQUUsS0FBMEI7UUFDbkUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxZQUFZLENBQUM7UUFDakUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQy9CLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQ2hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FDNUQsQ0FBQztJQUNKLENBQUM7OzJHQWZVLGNBQWM7K0dBQWQsY0FBYyxjQURELE1BQU07MkZBQ25CLGNBQWM7a0JBRDFCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgQ2FuQWN0aXZhdGUsIFJvdXRlciwgUm91dGVyU3RhdGVTbmFwc2hvdCB9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHsgdG9DaGFpbklkIH0gZnJvbSAnQG5nZXRoL2V0aGVycy1jb3JlJztcclxuaW1wb3J0IHsgbWFwLCB0YXAgfSBmcm9tIFwicnhqc1wiO1xyXG5pbXBvcnQgeyBTVVBQT1JURURfQ0hBSU5TIH0gZnJvbSBcIi4vY2hhaW5cIjtcclxuaW1wb3J0IHsgRVJDMTE5MyB9IGZyb20gXCIuL2VyYzExOTNcIjtcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBIYXNJbmplY3RlZFByb3ZpZGVyR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSB7XHJcbiAgcHVibGljIHByZXZpb3VzPzogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7fVxyXG5cclxuICBjYW5BY3RpdmF0ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpIHtcclxuICAgIGlmICgnZXRoZXJldW0nIGluIHdpbmRvdykgcmV0dXJuIHRydWU7XHJcbiAgICB0aGlzLnByZXZpb3VzID0gc3RhdGUudXJsO1xyXG4gICAgY29uc3QgcmVkaXJlY3QgPSByb3V0ZS5kYXRhWydoYXNJbmplY3RlZFByb3ZpZGVyUmVkaXJlY3QnXSA/PyAnL25vLWluamVjdGVkLXByb3ZpZGVyJztcclxuICAgIC8vIE5hdmlnYXRlIHRvIGF2b2lkIG5leHQgZ3VhcmQgdG8gcnVuXHJcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JlZGlyZWN0XSk7XHJcbiAgfVxyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgSGFzV2FsbGV0R3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSB7XHJcbiAgcHVibGljIHByZXZpb3VzPzogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVyYzExOTM6IEVSQzExOTMsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHt9XHJcblxyXG4gIGNhbkFjdGl2YXRlKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCkge1xyXG4gICAgaWYgKHRoaXMuZXJjMTE5My53YWxsZXRzLmxlbmd0aCkgcmV0dXJuIHRydWU7XHJcbiAgICB0aGlzLnByZXZpb3VzID0gc3RhdGUudXJsO1xyXG4gICAgY29uc3QgcmVkaXJlY3QgPSByb3V0ZS5kYXRhWydoYXNXYWxsZXRSZWRpcmVjdCddID8/ICcvbm8td2FsbGV0JztcclxuICAgIC8vIE5hdmlnYXRlIHRvIGF2b2lkIG5leHQgZ3VhcmQgdG8gcnVuXHJcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JlZGlyZWN0XSk7XHJcbiAgfVxyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgSXNTdXBwb3J0ZWRDaGFpbkd1YXJkIHtcclxuICBwdWJsaWMgcHJldmlvdXM/OiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxyXG4gICAgcHJpdmF0ZSBlcmMxMTkzOiBFUkMxMTkzLFxyXG4gICAgQEluamVjdChTVVBQT1JURURfQ0hBSU5TKSBwcml2YXRlIHN1cHBvcnRlZENoYWluczogJyonIHwgbnVtYmVyW10sXHJcbiAgKSB7fVxyXG4gIFxyXG4gIGNhbkFjdGl2YXRlKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCkge1xyXG4gICAgdGhpcy5wcmV2aW91cyA9IHN0YXRlLnVybDtcclxuICAgIGlmICh0aGlzLnN1cHBvcnRlZENoYWlucyA9PT0gJyonKSByZXR1cm4gdHJ1ZTtcclxuICAgIGlmICghdGhpcy5lcmMxMTkzLmNoYWluSWQpIHJldHVybiBmYWxzZTtcclxuICAgIGNvbnN0IGNoYWluSW5kZXggPSB0b0NoYWluSWQodGhpcy5lcmMxMTkzLmNoYWluSWQpO1xyXG4gICAgaWYgKHRoaXMuc3VwcG9ydGVkQ2hhaW5zLmluY2x1ZGVzKGNoYWluSW5kZXgpKSByZXR1cm4gdHJ1ZTtcclxuICAgIGNvbnN0IHJlZGlyZWN0ID0gcm91dGUuZGF0YVsnaXNTdXBwb3J0ZWRDaGFpblJlZGlyZWN0J10gPz8gJy91bnN1cHBvcnRlZC1jaGFpbic7XHJcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JlZGlyZWN0XSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIElzQ29ubmVjdGVkR3VhcmQgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSB7XHJcbiAgcHVibGljIHByZXZpb3VzPzogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXHJcbiAgICBwcml2YXRlIGVyYzExOTM6IEVSQzExOTNcclxuICApIHt9XHJcbiAgXHJcbiAgY2FuQWN0aXZhdGUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KSB7XHJcbiAgICB0aGlzLnByZXZpb3VzID0gc3RhdGUudXJsO1xyXG4gICAgY29uc3QgcmVkaXJlY3QgPSByb3V0ZS5kYXRhWydpc0Nvbm5lY3RlZFJlZGlyZWN0J10gPz8gJy9ub3QtY29ubmVjdGVkJztcclxuICAgIHJldHVybiB0aGlzLmVyYzExOTMuY29ubmVjdGVkJC5waXBlKFxyXG4gICAgICBtYXAoaXNDb25uZWN0ZWQgPT4gaXNDb25uZWN0ZWQgfHwgdGhpcy5yb3V0ZXIucGFyc2VVcmwocmVkaXJlY3QpKVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBIYXNTaWduZXJHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcclxuICBwdWJsaWMgcHJldmlvdXM/OiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcclxuICAgIHByaXZhdGUgZXJjMTE5MzogRVJDMTE5M1xyXG4gICkge31cclxuICBcclxuICBjYW5BY3RpdmF0ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpIHtcclxuICAgIHRoaXMucHJldmlvdXMgPSBzdGF0ZS51cmw7XHJcbiAgICBjb25zdCByZWRpcmVjdCA9IHJvdXRlLmRhdGFbJ2hhc1NpZ25lclJlZGlyZWN0J10gPz8gJy9uby1zaWduZXInO1xyXG4gICAgcmV0dXJuIHRoaXMuZXJjMTE5My5hY2NvdW50JC5waXBlKFxyXG4gICAgICB0YXAoY29uc29sZS5sb2cpLFxyXG4gICAgICBtYXAoYWNjb3VudCA9PiAhIWFjY291bnQgfHwgdGhpcy5yb3V0ZXIucGFyc2VVcmwocmVkaXJlY3QpKVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4iXX0=