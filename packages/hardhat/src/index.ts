import './lib/config';
// import '@nomiclabs/hardhat-ethers';
import { extendConfig, task } from 'hardhat/config';
import { join } from 'path';
import { generate, getContractNames } from './lib/generate';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { getDefaultConfig } from './lib/config';
import * as parserTypeScript from "prettier/parser-typescript";
import * as prettier from "prettier/standalone";

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
    await generate(hre);

    // Deploy all contract and update environment
    const fullNames = await getContractNames(hre);
    // structure: filepath:contractName
    const names = fullNames.map(name => name.split(':')[1] as string);

    const addresses: Record<string, string> = {};
    const autoDeploy = hre.config.ngeth.autoDeploy;
    
    for (const name in autoDeploy) {
      if (!names.includes(name)) {
        const error = `Contract "${name}" provided in ngeth.autoDeploy is not part of the contracts.`;
        const solution = `The list of available contracts is: [${names.join(', ')}].`;
        throw new Error(`${error} ${solution}`);
      }
    }

    // Deploy
    const deploy = async ([name, params]: [string, unknown[]]) => {
      const Contract = await (hre as any).ethers.getContractFactory(name);
      const contract = await Contract.deploy(...params);
      await contract.deployed();
      addresses[name] = contract.address;
    };
    await Promise.all(Object.entries(autoDeploy).map(deploy));

    // Create addresses
    const root = hre.config.paths.root;
    const outDir = join(root, hre.config.ngeth.outDir);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    const code = prettier.format(`export default ${JSON.stringify(addresses)};`, {
      parser: 'typescript',
      plugins: [parserTypeScript],
      printWidth: 120,
    });
    await fs.writeFile(join(outDir, 'addresses.ts'), code);

    // index.ts
    const exportAll = names
      .map((name) => `export * from "./contracts/${name}";`)
      .concat(`export { default as addresses } from './addresses';`)
      .join('\n');
    fs.writeFile(join(outDir, 'index.ts'), exportAll);
  }
);