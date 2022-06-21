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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL2d1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBdUMsTUFBTSxFQUF1QixNQUFNLGlCQUFpQixDQUFDO0FBQ25HLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNoQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQzs7OztBQUdwQyxNQUFNLE9BQU8sd0JBQXdCO0lBR25DLFlBQW9CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUcsQ0FBQztJQUV0QyxXQUFXLENBQUMsS0FBNkIsRUFBRSxLQUEwQjtRQUNuRSxJQUFJLFVBQVUsSUFBSSxNQUFNO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsSUFBSSx1QkFBdUIsQ0FBQztRQUN0RixzQ0FBc0M7UUFDdEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7cUhBWFUsd0JBQXdCO3lIQUF4Qix3QkFBd0IsY0FEWCxNQUFNOzJGQUNuQix3QkFBd0I7a0JBRHBDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOztBQWdCbEMsTUFBTSxPQUFPLGNBQWM7SUFHekIsWUFBb0Is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QURoQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUN2QixDQUFDO0lBRUosV0FBVyxDQUFDLEtBQTZCLEVBQUUsS0FBMEI7UUFDbkUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxZQUFZLENBQUM7UUFDakUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQy9CLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQ2hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FDNUQsQ0FBQztJQUNKLENBQUM7OzJHQWZVLGNBQWM7K0dBQWQsY0FBYyxjQURELE1BQU07MkZBQ25CLGNBQWM7a0JBRDFCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIENhbkFjdGl2YXRlLCBSb3V0ZXIsIFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XG5pbXBvcnQgeyB0b0NoYWluSWQgfSBmcm9tICdAbmdldGgvZXRoZXJzLWNvcmUnO1xuaW1wb3J0IHsgbWFwLCB0YXAgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgU1VQUE9SVEVEX0NIQUlOUyB9IGZyb20gXCIuL2NoYWluXCI7XG5pbXBvcnQgeyBFUkMxMTkzIH0gZnJvbSBcIi4vZXJjMTE5M1wiO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEhhc0luamVjdGVkUHJvdmlkZXJHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcbiAgcHVibGljIHByZXZpb3VzPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHt9XG5cbiAgY2FuQWN0aXZhdGUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KSB7XG4gICAgaWYgKCdldGhlcmV1bScgaW4gd2luZG93KSByZXR1cm4gdHJ1ZTtcbiAgICB0aGlzLnByZXZpb3VzID0gc3RhdGUudXJsO1xuICAgIGNvbnN0IHJlZGlyZWN0ID0gcm91dGUuZGF0YVsnaGFzSW5qZWN0ZWRQcm92aWRlclJlZGlyZWN0J10gPz8gJy9uby1pbmplY3RlZC1wcm92aWRlcic7XG4gICAgLy8gTmF2aWdhdGUgdG8gYXZvaWQgbmV4dCBndWFyZCB0byBydW5cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JlZGlyZWN0XSk7XG4gIH1cbn1cblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBIYXNXYWxsZXRHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcbiAgcHVibGljIHByZXZpb3VzPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZXJjMTE5MzogRVJDMTE5MywgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcikge31cblxuICBjYW5BY3RpdmF0ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpIHtcbiAgICBpZiAodGhpcy5lcmMxMTkzLndhbGxldHMubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbiAgICB0aGlzLnByZXZpb3VzID0gc3RhdGUudXJsO1xuICAgIGNvbnN0IHJlZGlyZWN0ID0gcm91dGUuZGF0YVsnaGFzV2FsbGV0UmVkaXJlY3QnXSA/PyAnL25vLXdhbGxldCc7XG4gICAgLy8gTmF2aWdhdGUgdG8gYXZvaWQgbmV4dCBndWFyZCB0byBydW5cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JlZGlyZWN0XSk7XG4gIH1cbn1cblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBJc1N1cHBvcnRlZENoYWluR3VhcmQge1xuICBwdWJsaWMgcHJldmlvdXM/OiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBlcmMxMTkzOiBFUkMxMTkzLFxuICAgIEBJbmplY3QoU1VQUE9SVEVEX0NIQUlOUykgcHJpdmF0ZSBzdXBwb3J0ZWRDaGFpbnM6ICcqJyB8IG51bWJlcltdLFxuICApIHt9XG4gIFxuICBjYW5BY3RpdmF0ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpIHtcbiAgICB0aGlzLnByZXZpb3VzID0gc3RhdGUudXJsO1xuICAgIGlmICh0aGlzLnN1cHBvcnRlZENoYWlucyA9PT0gJyonKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoIXRoaXMuZXJjMTE5My5jaGFpbklkKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgY2hhaW5JbmRleCA9IHRvQ2hhaW5JZCh0aGlzLmVyYzExOTMuY2hhaW5JZCk7XG4gICAgaWYgKHRoaXMuc3VwcG9ydGVkQ2hhaW5zLmluY2x1ZGVzKGNoYWluSW5kZXgpKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCByZWRpcmVjdCA9IHJvdXRlLmRhdGFbJ2lzU3VwcG9ydGVkQ2hhaW5SZWRpcmVjdCddID8/ICcvdW5zdXBwb3J0ZWQtY2hhaW4nO1xuICAgIHJldHVybiB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcmVkaXJlY3RdKTtcbiAgfVxufVxuXG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgSXNDb25uZWN0ZWRHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcbiAgcHVibGljIHByZXZpb3VzPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBlcmMxMTkzOiBFUkMxMTkzXG4gICkge31cbiAgXG4gIGNhbkFjdGl2YXRlKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCkge1xuICAgIHRoaXMucHJldmlvdXMgPSBzdGF0ZS51cmw7XG4gICAgY29uc3QgcmVkaXJlY3QgPSByb3V0ZS5kYXRhWydpc0Nvbm5lY3RlZFJlZGlyZWN0J10gPz8gJy9ub3QtY29ubmVjdGVkJztcbiAgICByZXR1cm4gdGhpcy5lcmMxMTkzLmNvbm5lY3RlZCQucGlwZShcbiAgICAgIG1hcChpc0Nvbm5lY3RlZCA9PiBpc0Nvbm5lY3RlZCB8fCB0aGlzLnJvdXRlci5wYXJzZVVybChyZWRpcmVjdCkpXG4gICAgKTtcbiAgfVxufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEhhc1NpZ25lckd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xuICBwdWJsaWMgcHJldmlvdXM/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIGVyYzExOTM6IEVSQzExOTNcbiAgKSB7fVxuICBcbiAgY2FuQWN0aXZhdGUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KSB7XG4gICAgdGhpcy5wcmV2aW91cyA9IHN0YXRlLnVybDtcbiAgICBjb25zdCByZWRpcmVjdCA9IHJvdXRlLmRhdGFbJ2hhc1NpZ25lclJlZGlyZWN0J10gPz8gJy9uby1zaWduZXInO1xuICAgIHJldHVybiB0aGlzLmVyYzExOTMuYWNjb3VudCQucGlwZShcbiAgICAgIHRhcChjb25zb2xlLmxvZyksXG4gICAgICBtYXAoYWNjb3VudCA9PiAhIWFjY291bnQgfHwgdGhpcy5yb3V0ZXIucGFyc2VVcmwocmVkaXJlY3QpKVxuICAgICk7XG4gIH1cbn1cblxuXG4iXX0=