/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ABIDescription, EventDescription, FunctionDescription } from '@type/solc';
import { getAllCalls, getAllEvents, getAllFilters, getAllMethods, getAllQueries, getAllStructs, isRead, isEvent, isWrite } from './utils';

export const getEthersContract = (contractName: string, abi: ABIDescription[]) => {
  const calls: FunctionDescription[] = abi.filter(isRead);
  const methods: FunctionDescription[] = abi.filter(isWrite);
  const events: EventDescription[] = abi.filter(isEvent);
  const structs = getAllStructs(abi);

  return `
  import { EthersContract, FilterParam, TypedFilter } from '@ngeth/ethers-core';
  import type { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, ContractTransaction, BytesLike, BigNumberish } from "ethers";
  import type { Provider } from '@ethersproject/providers';
  import abi from './abi';
  
  export interface ${contractName}Events {
    events: ${getAllEvents(events)},
    filters: ${getAllFilters(events)},
    queries: ${getAllQueries(events)}
  }
  
  ${structs}
  
  export class ${contractName} extends EthersContract<${contractName}Events> {
    // Read
    ${getAllCalls(calls, 'class')}

    // Write
    ${getAllMethods(methods, 'class')}

    constructor(address: string, signer?: Signer | Provider) {
      super(address, abi, signer);
    }
  }`;
}
