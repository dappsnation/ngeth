import { formatTs } from "./format";

export const getContractManager = (contractName: string) => {
  const code = `
  import { Injectable } from "@angular/core";
  import { ContractsManager } from "@ngeth/ethers";
  import { ${contractName} } from "./contract";

  @Injectable()
  export class ${contractName}Manager extends ContractsManager<${contractName}> {
    protected contractType = ${contractName};
  }`;
  return formatTs(code);
}