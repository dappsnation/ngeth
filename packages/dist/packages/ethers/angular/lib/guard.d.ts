import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { ERC1193 } from "./erc1193";
import * as i0 from "@angular/core";
export declare class HasInjectedProviderGuard implements CanActivate {
    private router;
    previous?: string;
    constructor(router: Router);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): true | Promise<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HasInjectedProviderGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HasInjectedProviderGuard>;
}
export declare class HasWalletGuard implements CanActivate {
    private erc1193;
    private router;
    previous?: string;
    constructor(erc1193: ERC1193, router: Router);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): true | Promise<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HasWalletGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HasWalletGuard>;
}
export declare class IsSupportedChainGuard {
    private router;
    private erc1193;
    private supportedChains;
    previous?: string;
    constructor(router: Router, erc1193: ERC1193, supportedChains: '*' | number[]);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IsSupportedChainGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IsSupportedChainGuard>;
}
export declare class IsConnectedGuard implements CanActivate {
    private router;
    private erc1193;
    previous?: string;
    constructor(router: Router, erc1193: ERC1193);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): import("rxjs").Observable<true | import("@angular/router").UrlTree>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IsConnectedGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IsConnectedGuard>;
}
export declare class HasSignerGuard implements CanActivate {
    private router;
    private erc1193;
    previous?: string;
    constructor(router: Router, erc1193: ERC1193);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): import("rxjs").Observable<true | import("@angular/router").UrlTree>;
    static ɵfac: i0.ɵɵFactoryDeclaration<HasSignerGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HasSignerGuard>;
}
