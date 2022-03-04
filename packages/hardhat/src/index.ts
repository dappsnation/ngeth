import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { join } from 'path';
import { generate, getContractNames } from './generate';
import { promises as fs } from 'fs';

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
  async (taskArguments: any, hre: HardhatRuntimeEnvironment) => {
    return hre.run('compile', taskArguments);
  }
);

task(
  'ngeth:serve',
  '',
  async (taskArguments: any, hre: HardhatRuntimeEnvironment) => {
    await hre.run('ngeth:build', taskArguments);
    return hre.run('node', taskArguments);
  }
);

task(
  'node:server-ready',
  'Run once the node is ready',
  async (taskArguments: any, hre: any, runSuper: any) => {
    await runSuper();
    await generate(hre);
    const root = hre.config.paths.root;
    const setEnv = (addresses: Record<string, string>) => {
      const envPath = join(root, 'environments/environment.ts');
      return fs.writeFile(
        envPath,
        `export default ${JSON.stringify({ addresses })};`
      );
    };

    // Deploy all contract and update environment
    const names = await getContractNames(hre);

    const addresses: Record<string, string> = {};
    const params: Record<string, string[]> = {
      BaseERC1155: [''],
    };

    const deploy = async (name: string) => {
      const [_, contractName] = name.split(':');
      const Contract = await hre.ethers.getContractFactory(name);
      const contract =
        contractName in params
          ? await Contract.deploy(...params[contractName])
          : await Contract.deploy();
      await contract.deployed();
      addresses[contractName] = contract.address;
    };
    await Promise.all(names.map(deploy));
    await setEnv(addresses);
  }
);
