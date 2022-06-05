import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from "@angular/router";
import { BlockExplorer } from "./explorer";

@Injectable({ providedIn: 'root' })
export class RedirectAddress implements CanActivate {
  constructor(private explorer: BlockExplorer, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): UrlTree {
    const address = route.paramMap.get('address');
    if (!address) return this.router.createUrlTree(['/']);
    const value = this.explorer.source.addresses[address];
    if (!value) return this.router.createUrlTree(['/']);
    const prefix = (value.isContract) ? '/contract' : '/account';
    return this.router.createUrlTree([prefix, address]);
  }
}