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

  const src = resolve('src');
  if (!existsSync(src)) mkdirSync(src);

  const folder = join(src, 'contracts');
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
  // index.ts
  const exportAll = allContracts
    .map((name) => `export * from "./contracts/${name}";`)
    .join('\n');
  fs.writeFile(join(src, 'index.ts'), exportAll);
}
