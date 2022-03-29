import './lib/config';
// import '@nomiclabs/hardhat-ethers';
import { extendConfig, task } from 'hardhat/config';
import { dirname, join, resolve } from 'path';
import { generate } from './lib/generate';
import { getDefaultConfig } from './lib/config';
import { deploy } from './lib/deploy';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { getContractImport } from '@ngeth/tools';

extendConfig((config) => {
  config.ngeth = getDefaultConfig(config)
});

task(
  'ngeth:test',
  'run test with jest',
  async (taskArguments: any, hre: any) => {
    const { runCLI } = await import('jest');
    const root = hre.config.paths.root;
    const jestConfig: any = { watch: taskArguments.watch ?? false };
    const failures = await runCLI(jestConfig, [join(root, '/jest.config.js')]);
    process.exitCode = failures.results.success ? 0 : 1;
  }
);

task(
  'ngeth:build',
  '',
  async (taskArguments: any, hre) => {
    return hre.run('compile', taskArguments);
  }
);

task(
  'ngeth:serve',
  '',
  async (taskArguments: any, hre) => {
    await hre.run('ngeth:build', taskArguments);
    return hre.run('node', taskArguments);
  }
);

task(
  'node:server-ready',
  'Run once the node is ready',
  async (taskArguments: any, hre, runSuper: any) => {
    await runSuper();

    const paths = await hre.artifacts.getAllFullyQualifiedNames();
    const artifacts = await Promise.all(paths.map(path => hre.artifacts.readArtifact(path)));
    const root = hre.config.paths.root;
    const outDir = join(root, hre.config.ngeth.outDir);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });


    await deploy(hre, artifacts);
    // Generate contracts & index.ts
    generate(hre, artifacts);


    // Generate imports
    if (hre.config.ngeth.withImports) {
      // Generate imports
      // TODO: check if bytecode === "0x" -> interface / abstract
      const src = resolve(hre.config.paths.sources);
      const importArtifacts = artifacts.filter(a => !resolve(a.sourceName).startsWith(src));
      const importFolder = join(outDir, 'imports');
      
      for (const artifact of importArtifacts) {
        if (!artifact.abi.length) continue; // No public API
        const contractName = artifact.contractName;
        const contract = getContractImport(contractName, artifact.abi);
        const output = join(importFolder, dirname(artifact.sourceName));
        if (!existsSync(output)) mkdirSync(output, { recursive: true });
        fs.writeFile(join(output, `${contractName}.ts`), contract);
      }
      const exportImports = importArtifacts
        .filter(artifact => artifact.abi.length)
        .map(artifact => `export * from "./${dirname(artifact.sourceName)}/${artifact.contractName}";`)
        .join('\n');
      fs.writeFile(join(importFolder, 'index.ts'), exportImports);
    }
  }
);