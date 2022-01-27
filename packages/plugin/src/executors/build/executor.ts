import { BuildExecutorSchema } from './schema';
import * as hre from 'hardhat';
import { ExecutorContext } from '@nrwl/devkit';

export default async function runExecutor(options: BuildExecutorSchema, context: ExecutorContext ) {
  const root = context.workspace.projects[context.projectName].root;

  await hre.run('compile', { config: `${root}/hardhat.config.js` });
  return {
    success: true,
  };
}
