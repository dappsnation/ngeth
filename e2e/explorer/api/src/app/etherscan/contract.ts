import { VerifySourceCode, GetParams, GetABI, GetSourceCode } from "@ngeth/etherscan";
import solc from 'solc';
import { CompilationInput, CompilationResult } from '@type/solc';
import { provider } from "../provider";
import { addArtifactToAddress, setArtifact, store } from "../store";
import { isContract } from "@explorer";
import { promises as fs } from 'fs';

async function verifySourceCode(params: GetParams<VerifySourceCode>) {
  const code = await provider.getCode(params.contractaddress);
  const { contractname, sourceCode, optimizationUsed, runs, evmversion } = params;
  const input: CompilationInput = {
    language: 'Solidity',
    sources: {
      [contractname]: {
        content: sourceCode
      }
    },
    settings: {
      optimizer: {
        enable: !!optimizationUsed,
        runs: runs ?? 200
      },
      evmVersion: evmversion ?? 'london',
      libraries: {}
    }
  }
  const sourceName = ''; // sourceName is going to be empty for this input
  const result: CompilationResult = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = result.contracts[sourceName][contractname];
  const deployedBytecode = contract.evm.deployedBytecode.object;
  if (deployedBytecode !== code) {
    throw new Error('Bytecode is not the same');
  }
  const artifact = { deployedBytecode, contractName: contractname, sourceName: '', abi: contract.abi };
  setArtifact(artifact);
  addArtifactToAddress(params.contractaddress, artifact);
}

export function getAbi({ address }: GetParams<GetABI>) {
  if (!address) throw new Error('Invalid Address format');
  const account = store.addresses[address];
  if(!isContract(account)) throw new Error('Contract source code not verified');

  return store.artifacts[account.artifact].abi;
}

export function getSourceCode({ address }: GetParams<GetSourceCode>) {
  if (!address) throw new Error('Invalid Address format');
  const account = store.addresses[address];
  if (!isContract(account)) throw new Error('Contract source code not verified');
  
  const optimization = store.builds[account.artifact].optimizationUsed ? "1" : "0";

  return {
    SourceCode: store.builds[account.artifact].sourceCode,
    ABI: store.artifacts[account.address].abi,
    ContractName: store.builds[account.artifact].contractName,
    CompilerVersion: store.builds[account.artifact].compilerVersion,
    OptimizationUsed: optimization,
    Runs: store.builds[account.artifact].runs
    }
}