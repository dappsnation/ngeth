import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { ContractsManager, MetaMask } from "@ngeth/ethers";
import { Contract } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { isOwnable } from "../contracts";

@Injectable({ providedIn: 'root' })
export class IsOwnerGuard implements CanActivate {

  constructor(
    private metamask: MetaMask,
    private manager: ContractsManager<Contract>,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot) {
    try {
      const address = route.paramMap.get('address');
      if (!address) throw new Error('The guad "IsOwnerGuard" should be used on a route with params "address"');
      const contract = this.manager.get(address, this.metamask.chainId);
      if (!isOwnable(contract)) throw new Error(`Contract with address "${address}" is not Ownable`);
      const owner = await contract.owner();
      if (getAddress(owner) === this.metamask.account) return true;
    } catch(err) {
      console.error(err);
    }
    const path = route.data['isOwnerRedirect'];
    return path ? this.router.parseUrl(path) : false;
  }

}