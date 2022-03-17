import { join, resolve } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getContract } from '@ngeth/tools';

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
    const { contractName, abi, bytecode } = await hre.artifacts.readArtifact(
      name
    );
    allContracts.push(contractName);

    const contract = getContract(contractName, abi);
    const path = join(folder, `${contractName}.ts`);
    fs.writeFile(path, contract);
  }
}
