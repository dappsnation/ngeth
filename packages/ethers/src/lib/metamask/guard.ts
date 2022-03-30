import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { ETH_PROVIDER, MetaMask } from "./index";
import { MetaMaskProvider } from "./types";
import { map } from "rxjs/operators";
import { SUPPORTED_CHAINS, toChainIndex } from "../chain";

@Injectable({ providedIn: 'root' })
export class IsConnectedGuard {
  public previous?: string;

  constructor(
    private router: Router,
    private metamask: MetaMask
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.previous = state.url;
    const redirect = route.data['isConnectedRedirect'] ?? '/not-connected';
    return this.metamask.connected$.pipe(
      map(isConnected => isConnected || this.router.parseUrl(redirect))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class HasSignerGuard {
  public previous?: string;

  constructor(
    private router: Router,
    private metamask: MetaMask
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.previous = state.url;
    const redirect = route.data['hasSignerRedirect'] ?? '/no-signer';
    return this.metamask.account$.pipe(
      map(account => !!account || this.router.parseUrl(redirect))
    );
  }
}


@Injectable({ providedIn: 'root' })
export class IsSupportedChainGuard {
  public previous?: string;
  constructor(
    private router: Router,
    private metamask: MetaMask,
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

@Injectable({ providedIn: 'root' })
export class HasProviderGuard implements CanActivate {
  public previous?: string;

  constructor(
    private router: Router,
    @Inject(ETH_PROVIDER) private provider?: MetaMaskProvider,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.provider) return true;
    this.previous = state.url;
    const redirect = route.data['hasProviderRedirect'] ?? '/no-provider';
    return this.router.parseUrl(redirect);
  }
}