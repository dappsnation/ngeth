import { dirname, join, resolve } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getEthersContract, getNgContract, getContractManager, getFactory, getContractImport } from '@ngeth/tools';
import { formatTs, getCompiledOutput } from './utils';
import { exportAddress } from './deploy';

const contractIndex = (contractName: string, type: 'angular' | 'typescript') => formatTs(`
  export * from './contract';
  export * from './factory';
  ${type === 'angular' ? "export * from './manager';" : ''}
  export { default as ${contractName}Abi } from './abi';
  export { default as ${contractName}Bytecode } from './bytecode';
`);

export async function generate(hre: HardhatRuntimeEnvironment) {
  const allArtifacts = await getCompiledOutput(hre);
  const root = hre.config.paths.root;
  const src = resolve(hre.config.paths.sources);
  const outputPath = resolve(root, hre.config.ngeth.outputPath);
  const hasAddresses = existsSync(join(outputPath, 'addresses.json'));

  // Generate local contracts
  localContracts: {
    const artifacts = allArtifacts.filter(a => resolve(a.sourceName).startsWith(src));
    if (!artifacts.length) break localContracts;
  
    const folder = join(outputPath, 'contracts');
  
    const write = artifacts.map(artifact => {
      const contractName = artifact.contractName;
      const contractFolder = join(folder, contractName);
      if (!existsSync(contractFolder)) mkdirSync(contractFolder, { recursive: true });
  
      const writeFile = (filename: string, content: string) => {
        return fs.writeFile(join(contractFolder, filename), content)
      }
  
      const type = hre.config.ngeth.outputType;
      const actions = [];
  
      if (type === 'angular') {
        const contract = getNgContract(contractName, artifact);
        const manager = getContractManager(contractName);
        actions.push(
          writeFile('contract.ts', formatTs(contract)),
          writeFile('manager.ts', formatTs(manager)),
        );
      }
  
      if (type === 'typescript') {
        const contract = getEthersContract(contractName, artifact);
        actions.push(writeFile('contract.ts', formatTs(contract)));
      }
    
      const factory = getFactory(contractName, artifact);
      const abi = `export default ${JSON.stringify(artifact.abi)}`;
      const bytecode = `export default "${artifact.bytecode}"`;
      const index = contractIndex(contractName, type);
    
      return Promise.all([
        writeFile('abi.ts', abi),
        writeFile('bytecode.ts', bytecode),
        writeFile('factory.ts', formatTs(factory)),
        writeFile('index.ts', index),
        ...actions
      ]);
    })
    await Promise.all(write);
    const exportContracts = artifacts.map(artifact => `export * from "./contracts/${artifact.contractName}";`);
    const code = hasAddresses
      ? exportContracts.concat(exportAddress).join('\n')
      : exportContracts.join('\n');
    await fs.writeFile(join(outputPath, 'index.ts'), code);
  }

  // Generate imports
  importedContract: if (hre.config.ngeth.withImports) {
    // TODO: check if bytecode === "0x" -> interface / abstract
    const src = resolve(hre.config.paths.sources);
    const importArtifacts = allArtifacts.filter(a => !resolve(a.sourceName).startsWith(src));
    if (!importArtifacts) break importedContract;
    const importFolder = join(outputPath, 'imports');
    if (!existsSync(importFolder)) mkdirSync(importFolder);

    for (const artifact of importArtifacts) {
      if (!artifact.abi.length) continue; // No public API
      const contractName = artifact.contractName;
      const contract = getContractImport(contractName, artifact);
      const output = join(importFolder, dirname(artifact.sourceName));
      if (!existsSync(output)) mkdirSync(output, { recursive: true });
      await fs.writeFile(join(output, `${contractName}.ts`), formatTs(contract));
    }
    const exportImports = importArtifacts
      .filter(artifact => artifact.abi.length)
      .map(artifact => `export * from "./${dirname(artifact.sourceName)}/${artifact.contractName}";`)
      .join('\n');
    await fs.writeFile(join(importFolder, 'index.ts'), exportImports);
  }
}
