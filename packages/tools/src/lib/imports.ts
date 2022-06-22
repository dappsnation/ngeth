import { FunctionDescription } from '@type/solc';
import { getContractEvents } from './events';
import { toJsDoc } from './natspec';
import { Config, GenerateConfig, getAllCalls, getAllMethods, getAllStructs, isRead, isWrite } from './utils';

export const getContractImport = (contractName: string, { abi, natspec }: GenerateConfig) => {
  const config: Config = { exports: 'interface', natspec };
  const calls: FunctionDescription[] = abi.filter(isRead);
  const methods: FunctionDescription[] = abi.filter(isWrite);
  const structs = getAllStructs(abi);
  const doc = toJsDoc(natspec?.['class']);

  return `
  import { EthersContract, FilterParam, TypedFilter } from '@ngeth/ethers-core';
  import type { Contract, BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, ContractTransaction, BytesLike, BigNumberish } from "ethers";
  
  ${getContractEvents(contractName, abi, config)}
  
  ${structs}
  
  ${doc}
  export interface ${contractName} extends EthersContract<${contractName}Events> {
    ${getAllCalls(calls, config)}
    ${getAllMethods(methods, config)}
  }

  export const ${contractName}Abi = ${JSON.stringify(abi)};`;
}
