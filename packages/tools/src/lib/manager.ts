export const getContractManager = (contractName: string) => {
  return `
  import { Injectable } from "@angular/core";
  import { ContractsManager, ngContract } from "@ngeth/ethers-angular";
  import { ${contractName} } from "./contract";

  @Injectable({ providedIn: 'root' })
  export class ${contractName}Manager extends ContractsManager<${contractName}> {
    
    createInstance(address: string) {
      const contract = ngContract(${contractName});
      return new contract(address, this.signer, this.zone);
    }
  }`;
}