import { join, resolve } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getContract, getFactory } from '@ngeth/tools';

const contractIndex = (contractName: string) => `
export * from './contract';
export * from './factory';
export { default as ${contractName}Abi } from './abi';
export { default as ${contractName}Bytecode } from './bytecode';
`

export async function getContractNames(hre: HardhatRuntimeEnvironment) {
  const allNames = await hre.artifacts.getAllFullyQualifiedNames();
  const src = resolve(hre.config.paths.sources);
  return allNames.filter((name) => resolve(name).startsWith(src));
}

export async function generate(hre: HardhatRuntimeEnvironment) {
  const names = await getContractNames(hre);
  if (!names.length) return;

  const root = hre.config.paths.root;
  const outDir = resolve(root, hre.config.ngeth.outDir);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  const folder = join(outDir, 'contracts');
  if (!existsSync(folder)) mkdirSync(folder);

  const allContracts: string[] = [];
  for (const name of names) {
    const res = await hre.artifacts.readArtifact(name);
    const contractName = res.contractName;
    allContracts.push(contractName);

    const contract = getContract(contractName, res.abi);
    const factory = getFactory(contractName, res.abi);
    const abi = `export default ${JSON.stringify(res.abi)}`;
    const bytecode = `export default "${res.bytecode}"`;
    const index = contractIndex(contractName);

    const contractFolder = join(folder, contractName);
    if (!existsSync(contractFolder)) mkdirSync(contractFolder);
    fs.writeFile(join(contractFolder, 'abi.ts'), abi);
    fs.writeFile(join(contractFolder, 'bytecode.ts'), bytecode);
    fs.writeFile(join(contractFolder, 'contract.ts'), contract);
    fs.writeFile(join(contractFolder, 'factory.ts'), factory);
    fs.writeFile(join(contractFolder, 'index.ts'), index);
  }
}
