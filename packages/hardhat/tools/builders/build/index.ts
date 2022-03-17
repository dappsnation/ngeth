import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { getContract } from '@ngeth/tools';
import { join } from 'path';
import * as hre from 'hardhat';

export interface BuildExecutorSchema {
  tsconfig: string;
  hardhatConfig: string;
}

export default createBuilder(async (options: BuildExecutorSchema, context: BuilderContext): Promise<BuilderOutput> => {
  const projectName = context.target?.project;
  if (!projectName) throw new Error('No project found');
  const root = context.workspaceRoot;
  const { tsconfig, hardhatConfig } = options;

  process.env.HARDHAT_CONFIG = join(root, hardhatConfig);
  process.env.HARDHAT_TSCONFIG = join(root, tsconfig);

  
  // We need to import hardhat after updating the process.env
  await hre.run('compile', { config: join(root, tsconfig) });
  console.log(getContract('Hello', []));
  // const names = await hre.artifacts.getAllFullyQualifiedNames();

  // const source = resolve(hre.config.paths.sources);
  // const addresses: Record<string, string> = {};
  // const deploy = async (name: string) => {
  //   const path = resolve(join(root, name));
  //   if (path.startsWith(source)) {
  //     const Contract = await (hre as any).ethers.getContractFactory(name);
  //     const contract = await Contract.deploy();
  //     await contract.deployed();
  //     const [_, contractName] = name.split(':');
  //     addresses[contractName] = contract.address;
  //   }
  // }
  // await Promise.all(names.map(deploy));

  // const envPath = join(root, 'environment/environment.ts');
  // await fs.writeFile(envPath, `export default ${JSON.stringify({addresses})};`);

  return {
    success: true,
  };
});
