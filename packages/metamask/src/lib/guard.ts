import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { MetaMask } from "./service";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class HasMetamaskGuard implements CanActivate {
  public previous?: string;

  constructor(
    private router: Router,
    private metamask: MetaMask,
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.metamask.hasMetamask()) return true;
    this.previous = state.url;
    const redirect = route.data['hasMetamaskRedirect'] ?? '/no-metamask';
    return this.router.navigateByUrl(redirect);
  }
}

@Injectable({ providedIn: 'root' })
export class IsConnectedGuard implements CanActivate {
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
export class HasSignerGuard implements CanActivate {
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


