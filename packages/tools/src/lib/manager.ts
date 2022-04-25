import { formatTs } from "./format";

export const getContractManager = (contractName: string) => {
  const code = `
  import { Injectable } from "@angular/core";
  import { ContractsManager } from "@ngeth/ethers";
  import { ${contractName} } from "./contract";

  @Injectable({ providedIn: 'root' })
  export class ${contractName}Manager extends ContractsManager<${contractName}> {
    
    create(address: string) {
      return new ${contractName}(address, this.metamask.getSigner(), this.zone);
    }
  }`;
  return formatTs(code);
}