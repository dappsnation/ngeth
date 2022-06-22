import { toMethodJsDoc } from "./natspec";
import { GenerateConfig, getDeploy, isConstrutor } from "./utils";


export const getFactory = (contractName: string, { abi, natspec }: GenerateConfig) => {
  const node = abi.find(isConstrutor);
  const deploy = getDeploy(contractName, node?.inputs);
  const doc = node ? toMethodJsDoc(natspec?.methods?.['constructor']) : '';

  return `
  import { ContractFactory } from '@ethersproject/contracts';
  import type { ${contractName} } from './contract';
  import type { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, BytesLike, BigNumberish } from "ethers";
  import abi from './abi';
  import bytecode from './bytecode';

  export class ${contractName}Factory extends ContractFactory {
    ${doc}
    override ${deploy};

    constructor(signer?: Signer) {
      super(abi, bytecode, signer);
    }
  }`;
}