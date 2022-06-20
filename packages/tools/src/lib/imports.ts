/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ABIDescription, EventDescription, FunctionDescription } from '@type/solc';
import { getAllCalls, getAllEvents, getAllFilters, getAllMethods, getAllQueries, getAllStructs, isRead, isEvent, isWrite } from './utils';

export const getContractImport = (contractName: string, abi: ABIDescription[]) => {
  const calls: FunctionDescription[] = abi.filter(isRead);
  const methods: FunctionDescription[] = abi.filter(isWrite);
  const events: EventDescription[] = abi.filter(isEvent);
  const structs = getAllStructs(abi);
  

  return `
  import { NgContract, FilterParam, TypedFilter } from '@ngeth/ethers-angular';
  import type { Contract, BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, ContractTransaction, BytesLike, BigNumberish } from "ethers";
  
  export interface ${contractName}Events {
    events: ${getAllEvents(events)},
    filters: ${getAllFilters(events)},
    queries: ${getAllQueries(events)}
  }
  
  ${structs}
  
  export interface ${contractName} extends NgContract<${contractName}Events> {
    ${getAllCalls(calls, 'interface')}
    ${getAllMethods(methods, 'interface')}
  }

  export function is${contractName}(contract: Contract): contract is ${contractName} {
    return ${contractName}Abi
      .filter(def => def.type === 'function')
      .every(def => def.name && def.name in contract.functions);
  }

  export const ${contractName}Abi = ${JSON.stringify(abi)};`;
}
