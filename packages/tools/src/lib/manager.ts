export const getContractManager = (contractName: string) => {
  return `
  import { Injectable } from "@angular/core";
  import { ContractsManager } from "@ngeth/ethers-angular";
  import { ${contractName} } from "./contract";

  @Injectable({ providedIn: 'root' })
  export class ${contractName}Manager extends ContractsManager<${contractName}> {
    
    createInstance(address: string) {
      return new ${contractName}(address, this.signer, this.zone);
    }
  }`;
}