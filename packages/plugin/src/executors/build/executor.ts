import { BuildExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';
import { join, resolve } from 'path';
import { promises as fs } from 'fs';

export default async function runExecutor(options: BuildExecutorSchema, context: ExecutorContext ) {
  const root = context.workspace.projects[context.projectName].root;
  const {
    tsconfig = 'tsconfig.lib.json',
    hardhatConfig = 'hardhat.config.ts'
  } = options;

  process.env.HARDHAT_CONFIG = join(context.cwd, root, hardhatConfig);
  process.env.HARDHAT_TSCONFIG = join(context.cwd, root, tsconfig);

  // We need to import hardhat after updating the process.env
  const hre = await import('hardhat');
  await hre.run('compile');
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
}
