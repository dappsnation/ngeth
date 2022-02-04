import { TestExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';
import { join } from 'path';

export default async function runExecutor(options: TestExecutorSchema, context: ExecutorContext) {
  const root = context.workspace.projects[context.projectName].root;
  process.env.HARDHAT_CONFIG = join(__dirname, root, 'hardhat.config.js');
  
  // We need to import hardhat after updating the process.env
  const hre = await import('hardhat');
  await hre.run('test');
  return {
    success: true
  }
}

