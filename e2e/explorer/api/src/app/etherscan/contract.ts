import { VerifySourceCode, GetParams, GetABIRequest, GetSourceCodeRequest, ContractSourceCodeResponse } from "@ngeth/etherscan";
import solc from 'solc';
import { CompilationInput, CompilationResult } from '@type/solc';
import { provider } from "../provider";
import { addArtifactToAddress, compareWithEvmOutput, getArtifact, setArtifact, store } from "../store";
import { isContract } from "@explorer";
import { emit } from "../socket";


export async function verifySourceCode(params: GetParams<VerifySourceCode>) {
  const code = await provider.getCode(params.contractaddress);
  const { contractname, sourceCode, optimizationUsed, runs, evmversion, constructorArguements } = params;

  let artifact = getArtifact(code);
  if (artifact) return artifact;

  const input: CompilationInput = {
    language: 'Solidity',
    sources: {
      [`${contractname}.sol`]: {
        content: sourceCode
      }
    },
    settings: {
      optimizer: {
        enabled: !!optimizationUsed,
        runs: runs ?? 200
      },
      evmVersion: evmversion ?? 'london',
      libraries: {},
      outputSelection: {
        "*": {
          "*": [
            "abi",
            "evm.bytecode",
            "evm.deployedBytecode",
          ]
        }
      }
    }
  }
  const sourceName = `${contractname}.sol`; // sourceName is going to be empty for this input
  try {
    const output = solc.compile(JSON.stringify(input));
    const result: CompilationResult = JSON.parse(output);

    // check errors
    let hasError: string | undefined;
    for (const error of result.errors || []) {
      if (error.severity === 'Warning') console.warn(error.formattedMessage ?? error.message);
      if (error.severity === 'error') {
        console.error(error.formattedMessage ?? error.message);
        hasError = error.message;
      }
    }
    if (hasError) throw new Error(hasError);
  
    
    const contract = result.contracts[sourceName][contractname];
    const deployedBytecode = contract.evm.deployedBytecode.object;
    // TODO: check immutableReference (extract code from getArtifact(code) method)
    if (deployedBytecode !== code || compareWithEvmOutput(code, contract.evm as any)) {
      throw new Error('Bytecode is not the same');
    }
    artifact = { deployedBytecode, contractName: contractname, sourceName, abi: contract.abi };
    setArtifact(artifact);
    await addArtifactToAddress(params.contractaddress, artifact);
    emit();
    return true;
  } catch(err) {
    console.error(err);
    return err;
  }
}

/** Returns the Contract Application Binary Interface ( ABI ) of a verified smart contract. */
export function getAbi({ address }: GetParams<GetABIRequest>) {
  if (!address) throw new Error('Invalid Address format');
  const account = store.addresses[address];
  if(!isContract(account)) throw new Error('Contract source code not verified');

  return store.artifacts[account.artifact].abi;
}

/** Returns the Solidity source code of a verified smart contract. */
export function getSourceCode({ address }: GetParams<GetSourceCodeRequest>): ContractSourceCodeResponse {
  if (!address) throw new Error('Invalid Address format');
  const account = store.addresses[address];
  if (!isContract(account)) throw new Error('Contract source code not verified');
  
  const optimization = store.builds[account.artifact].optimizationUsed ? "1" : "0";

  return {
    SourceCode: store.builds[account.artifact].sourceCode,
    ABI: store.artifacts[account.address].abi.toString(),
    ContractName: store.builds[account.artifact].contractName,
    CompilerVersion: store.builds[account.artifact].compilerVersion,
    OptimizationUsed: optimization,
    Runs: store.builds[account.artifact].runs,
    ConstructorArguments: "",
    EVMVersion:  "",
    Library:  "",
    LicenseType:  "",
    Proxy:  "",
    Implementation:  "",
    SwarmSource:  "",
  };
}