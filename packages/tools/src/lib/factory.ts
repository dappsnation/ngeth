import { formatTs } from "./format";
import { ABIDescription } from "./types";
import { getDeploy, isConstrutor } from "./utils";




export const getFactory = (contractName: string, abi: ABIDescription[]) => {
  const deploy = getDeploy(contractName, abi.find(isConstrutor)?.inputs);
  const code = `
  import { ContractFactory } from '@ethersproject/contracts';
  import type { ${contractName} } from './contract';
  import type { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, BytesLike, BigNumberish } from "ethers";
  import abi from './abi';
  import bytecode from './bytecode';

  export class ${contractName}Factory extends ContractFactory {
    override ${deploy};

    constructor(signer?: Signer) {
      super(abi, bytecode, signer);
    }
  }`;
  return formatTs(code);
}