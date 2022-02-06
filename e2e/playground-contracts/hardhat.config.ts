import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';

import { task } from 'hardhat/config';
import { join } from 'path';
import { promises as fs } from 'fs';
import { generate, getContractNames } from './scripts/ng-generate';

task(
  'node:server-ready',
  'Run once the node is ready',
  async (taskArguments: any, hre: any, runSuper: any) => {
    await runSuper();
    await generate(hre);

    // Deploy all contract and update environment
    const names = await getContractNames(hre);

    const addresses = {};
    const deploy = async (name: string) => {
      const Contract = await hre.ethers.getContractFactory(name);
      const contract = await Contract.deploy();
      await contract.deployed();
      const [_, contractName] = name.split(':');
      addresses[contractName] = contract.address;
    };
    await Promise.all(names.map(deploy));

    const envPath = join(__dirname, 'environments/environment.ts');
    await fs.writeFile(
      envPath,
      `export default ${JSON.stringify({ addresses })};`
    );
  }
);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: '0.8.2',
  paths: {
    sources: './contracts',
    tests: './tests',
    artifacts: './artifacts',
    typechain: './typechain',
  },
};
