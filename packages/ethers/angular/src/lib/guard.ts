import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { toChainId } from '@ngeth/ethers-core';
import { map, tap } from "rxjs";
import { SUPPORTED_CHAINS } from "./chain";
import { ERC1193 } from "./erc1193";

@Injectable({ providedIn: 'root' })
export class HasInjectedProviderGuard implements CanActivate {
  public previous?: string;

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if ('ethereum' in window) return true;
    this.previous = state.url;
    const redirect = route.data['hasInjectedProviderRedirect'] ?? '/no-injected-provider';
    // Navigate to avoid next guard to run
    return this.router.navigate([redirect]);
  }
}

@Injectable({ providedIn: 'root' })
export class HasWalletGuard implements CanActivate {
  public previous?: string;

  constructor(private erc1193: ERC1193, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.erc1193.wallets.length) return true;
    this.previous = state.url;
    const redirect = route.data['hasWalletRedirect'] ?? '/no-wallet';
    // Navigate to avoid next guard to run
    return this.router.navigate([redirect]);
  }
}

@Injectable({ providedIn: 'root' })
export class IsSupportedChainGuard {
  public previous?: string;
  constructor(
    private router: Router,
    private erc1193: ERC1193,
    @Inject(SUPPORTED_CHAINS) private supportedChains: '*' | number[],
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.previous = state.url;
    if (this.supportedChains === '*') return true;
    if (!this.erc1193.chainId) return false;
    const chainIndex = toChainId(this.erc1193.chainId);
    if (this.supportedChains.includes(chainIndex)) return true;
    const redirect = route.data['isSupportedChainRedirect'] ?? '/unsupported-chain';
    return this.router.navigate([redirect]);
  }
}


@Injectable({ providedIn: 'root' })
export class IsConnectedGuard implements CanActivate {
  public previous?: string;

  constructor(
    private router: Router,
    private erc1193: ERC1193
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.previous = state.url;
    const redirect = route.data['isConnectedRedirect'] ?? '/not-connected';
    return this.erc1193.connected$.pipe(
      map(isConnected => isConnected || this.router.parseUrl(redirect))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class HasSignerGuard implements CanActivate {
  public previous?: string;

  constructor(
    private router: Router,
    private erc1193: ERC1193
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.previous = state.url;
    const redirect = route.data['hasSignerRedirect'] ?? '/no-signer';
    return this.erc1193.account$.pipe(
      tap(console.log),
      map(account => !!account || this.router.parseUrl(redirect))
    );
  }
}


