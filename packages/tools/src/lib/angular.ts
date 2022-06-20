/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ABIDescription, FunctionDescription } from '@type/solc';
import { getContractEvents } from './events';
import { getAllCalls,  getAllMethods, getAllStructs, isRead, isWrite } from './utils';

export const getNgContract = (contractName: string, abi: ABIDescription[]) => {
  const calls: FunctionDescription[] = abi.filter(isRead);
  const methods: FunctionDescription[] = abi.filter(isWrite);
  const structs = getAllStructs(abi);

  return `
  import { NgZone } from '@angular/core';
  import { FilterParam, TypedFilter } from '@ngeth/ethers-core';
  import { NgContract } from '@ngeth/ethers-angular';
  import type { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, ContractTransaction, BytesLike, BigNumberish } from "ethers";
  import type { Provider } from '@ethersproject/providers';
  import abi from './abi';
  
  ${getContractEvents(contractName, abi)}
  
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
}
