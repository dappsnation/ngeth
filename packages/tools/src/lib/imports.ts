import { FunctionDescription } from '@type/solc';
import { getContractDeps } from './deps';
import { getContractEvents } from './events';
import { toContractJsDoc } from './natspec';
import { Config, GenerateConfig, getAllCalls, getAllMethods, getAllStructs, isRead, isWrite } from './utils';

export const getContractImport = (contractName: string, { abi, natspec }: GenerateConfig) => {
  const config: Config = { exports: 'interface', natspec };
  const calls: FunctionDescription[] = abi.filter(isRead);
  const methods: FunctionDescription[] = abi.filter(isWrite);
  const structs = getAllStructs(abi);
  const doc = toContractJsDoc(natspec);
  const deps = getContractDeps(abi);

  return `
  import { EthersContract } from '@ngeth/ethers-core';
  import type { FilterParam, TypedFilter } from '@ngeth/ethers-core';
  import type { ${deps} } from "ethers";
  
  ${getContractEvents(contractName, abi, config)}
  
  ${structs}
  
  ${doc}
  export interface ${contractName} extends EthersContract<${contractName}Events> {
    ${getAllCalls(calls, config)}
    ${getAllMethods(methods, config)}
  }

  export const ${contractName}Abi = ${JSON.stringify(abi)};`;
}
