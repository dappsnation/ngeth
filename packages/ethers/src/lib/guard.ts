import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { SUPPORTED_CHAINS, toChainIndex } from "./chain";
import { ERC1193 } from "./erc1193";

@Injectable({ providedIn: 'root' })
export class HasProviderGuard implements CanActivate {
  public previous?: string;

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if ('ethereum' in window) return true;
    this.previous = state.url;
    const redirect = route.data['hasProviderRedirect'] ?? '/no-provider';
    return this.router.parseUrl(redirect);
  }
}

@Injectable({ providedIn: 'root' })
export class IsSupportedChainGuard {
  public previous?: string;
  constructor(
    private router: Router,
    private metamask: ERC1193,
    @Inject(SUPPORTED_CHAINS) private supportedChains: '*' | number[],
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.previous = state.url;
    if (this.supportedChains === '*') return true;
    const chainIndex = toChainIndex(this.metamask.chainId);
    if (this.supportedChains.includes(chainIndex)) return true;
    const redirect = route.data['isSupportedChainRedirect'] ?? '/unsupported-chain';
    return this.router.parseUrl(redirect);
  }
}

