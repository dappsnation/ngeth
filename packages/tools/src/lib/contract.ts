/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { formatTs } from './format';
import { ABIDescription, EventDescription, FunctionDescription } from '@type/solc';
import { getAllCalls, getAllEvents, getAllFilters, getAllMethods, getAllQueries, getAllStructs, isRead, isEvent, isWrite } from './utils';

export const getContract = (contractName: string, abi: ABIDescription[]) => {
  const calls: FunctionDescription[] = abi.filter(isRead);
  const methods: FunctionDescription[] = abi.filter(isWrite);
  const events: EventDescription[] = abi.filter(isEvent);
  const structs = getAllStructs(abi);

  const code = `
  import { NgZone } from '@angular/core';
  import { NgContract, FilterParam, TypedFilter } from '@ngeth/ethers';
  import type { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, ContractTransaction, BytesLike, BigNumberish } from "ethers";
  import type { Provider } from '@ethersproject/providers';
  import abi from './abi';
  
  export interface ${contractName}Events {
    events: ${getAllEvents(events)},
    filters: ${getAllFilters(events)},
    queries: ${getAllQueries(events)}
  }
  
  ${structs}
  
  export class ${contractName} extends NgContract<${contractName}Events> {
    // Read
    ${getAllCalls(calls, 'class')}

    // Write
    ${getAllMethods(methods, 'class')}

    constructor(address: string, signer?: Signer | Provider, zone?: NgZone) {
      super(address, abi, signer, zone);
    }
  }`;
  return formatTs(code);
}
