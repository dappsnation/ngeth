/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ABIDescription, FunctionDescription } from '@type/solc';
import { getContractEvents } from './events';
import { getAllCalls, getAllMethods, getAllStructs, isRead, isWrite } from './utils';

export const getContractImport = (contractName: string, abi: ABIDescription[]) => {
  const calls: FunctionDescription[] = abi.filter(isRead);
  const methods: FunctionDescription[] = abi.filter(isWrite);
  const structs = getAllStructs(abi);

  return `
  import { EthersContract, FilterParam, TypedFilter } from '@ngeth/ethers-core';
  import type { Contract, BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, ContractTransaction, BytesLike, BigNumberish } from "ethers";
  
  ${getContractEvents(contractName, abi)}
  
  ${structs}
  
  export interface ${contractName} extends EthersContract<${contractName}Events> {
    ${getAllCalls(calls, 'interface')}
    ${getAllMethods(methods, 'interface')}
  }

  export const ${contractName}Abi = ${JSON.stringify(abi)};`;
}
