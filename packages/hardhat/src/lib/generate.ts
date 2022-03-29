import { join, resolve } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { Artifact, HardhatRuntimeEnvironment } from 'hardhat/types';
import { getContract, getFactory } from '@ngeth/tools';


const contractIndex = (contractName: string) => `
export * from './contract';
export * from './factory';
export { default as ${contractName}Abi } from './abi';
export { default as ${contractName}Bytecode } from './bytecode';
`;

export function generate(hre: HardhatRuntimeEnvironment, allArtifacts: Artifact[]) {
  const root = hre.config.paths.root;
  const src = resolve(hre.config.paths.sources);
  const artifacts = allArtifacts.filter(a => resolve(a.sourceName).startsWith(src));
  if (!artifacts.length) return [];

  const outDir = resolve(root, hre.config.ngeth.outDir);
  const folder = join(outDir, 'contracts');

  for (const artifact of artifacts) {
    const contractName = artifact.contractName;
  
    const contract = getContract(contractName, artifact.abi);
    const factory = getFactory(contractName, artifact.abi);
    const abi = `export default ${JSON.stringify(artifact.abi)}`;
    const bytecode = `export default "${artifact.bytecode}"`;
    const index = contractIndex(contractName);
  
    const contractFolder = join(folder, contractName);
    if (!existsSync(contractFolder)) mkdirSync(contractFolder, { recursive: true });
    fs.writeFile(join(contractFolder, 'abi.ts'), abi);
    fs.writeFile(join(contractFolder, 'bytecode.ts'), bytecode);
    fs.writeFile(join(contractFolder, 'contract.ts'), contract);
    fs.writeFile(join(contractFolder, 'factory.ts'), factory);
    fs.writeFile(join(contractFolder, 'index.ts'), index);
  }

  return artifacts;
}
