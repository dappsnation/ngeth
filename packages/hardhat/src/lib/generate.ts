import { join, resolve } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { Artifact, HardhatRuntimeEnvironment } from 'hardhat/types';
import { getEthersContract, getNgContract, getContractManager, getFactory } from '@ngeth/tools';
import { formatTs } from './utils';


const contractIndex = (contractName: string, type: 'angular' | 'typescript') => formatTs(`
  export * from './contract';
  export * from './factory';
  ${type === 'angular' ? "export * from './manager';" : ''}
  export { default as ${contractName}Abi } from './abi';
  export { default as ${contractName}Bytecode } from './bytecode';
`);

export async function generate(hre: HardhatRuntimeEnvironment, allArtifacts: Artifact[]) {
  const root = hre.config.paths.root;
  const src = resolve(hre.config.paths.sources);
  const artifacts = allArtifacts.filter(a => resolve(a.sourceName).startsWith(src));
  if (!artifacts.length) return;

  const outDir = resolve(root, hre.config.ngeth.outDir);
  const folder = join(outDir, 'contracts');

  const write = artifacts.map(artifact => {
    const contractName = artifact.contractName;
    const contractFolder = join(folder, contractName);
    if (!existsSync(contractFolder)) mkdirSync(contractFolder, { recursive: true });

    const writeFile = (filename: string, content: string) => {
      return fs.writeFile(join(contractFolder, filename), content)
    }

    const type = hre.config.ngeth.type;
    const actions = [];

    if (type === 'angular') {
      const contract = getNgContract(contractName, artifact.abi);
      const manager = getContractManager(contractName);
      actions.push(
        writeFile('contract.ts', formatTs(contract)),
        writeFile('manager.ts', formatTs(manager)),
      );
    }

    if (type === 'typescript') {
      const contract = getEthersContract(contractName, artifact.abi);
      actions.push(writeFile('contract.ts', formatTs(contract)));
    }
  
    const factory = getFactory(contractName, artifact.abi);
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
  const exportContracts = artifacts
    .map(artifact => `export * from "./contracts/${artifact.contractName}";`)
    .concat(`export { default as addresses } from './addresses';`)
    .join('\n');
  return fs.writeFile(join(outDir, 'index.ts'), exportContracts);
}
