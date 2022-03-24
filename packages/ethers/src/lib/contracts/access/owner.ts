import { CallOverrides, Contract } from "ethers";

interface Owner extends Contract {
  owner: (overrides?: CallOverrides) => Promise<string>;
  
}

export function isOwner(contract: Contract): contract is Owner {
  return true;
}