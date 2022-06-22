import { FunctionDescription } from '@type/solc';
import { getContractEvents } from './events';
import { toJsDoc } from './natspec';
import { Config, GenerateConfig, getAllCalls, getAllMethods, getAllStructs, isRead, isWrite } from './utils';

export const getEthersContract = (contractName: string, { abi, natspec }: GenerateConfig) => {
  const config: Config = { exports: 'class', natspec };
  const calls: FunctionDescription[] = abi.filter(isRead);
  const methods: FunctionDescription[] = abi.filter(isWrite);
  const structs = getAllStructs(abi);

  console.log(natspec)
  const doc = toJsDoc(natspec?.['class']);

  return `
  import { EthersContract, FilterParam, TypedFilter } from '@ngeth/ethers-core';
  import type { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, ContractTransaction, BytesLike, BigNumberish } from "ethers";
  import type { Provider } from '@ethersproject/providers';
  import abi from './abi';
  
  ${getContractEvents(contractName, abi, config)}
  
  ${structs}
  
  ${doc}
  export class ${contractName} extends EthersContract<${contractName}Events> {
    // Read
    ${getAllCalls(calls, config)}

    // Write
    ${getAllMethods(methods, config)}

    constructor(address: string, signer?: Signer | Provider) {
      super(address, abi, signer);
    }
  }`;
}
