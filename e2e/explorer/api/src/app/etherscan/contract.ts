import { VerifySourceCode, GetParams } from "./types";
import solc from 'solc';
import { CompilationInput, CompilationResult } from '@type/solc';
import { provider } from "../block";
import { setABI } from "../abi";


async function verifySourceCode(params: GetParams<VerifySourceCode>) {
  const code = await provider.getCode(params.contractaddress);
  const input: CompilationInput = {
    language: 'Solidity',
    sources: {
      [params.contractname]: {
        content: params.sourceCode
      }
    },
    settings: {
      optimizer: {
        enable: !!params.optimizationUsed,
        runs: params.runs ?? 200
      },
      evmVersion: params.evmversion ?? 'london',
      libraries: {}
    }
  }
  const result: CompilationResult = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = result.contracts[''][params.contractname];
  const bytecode = contract.evm.deployedBytecode.object;
  if (bytecode !== code) {
    throw new Error('Bytecode is not the same');
  }
  setABI(params.contractaddress, contract.abi);
}