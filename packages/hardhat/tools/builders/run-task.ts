import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { execute } from '@ngeth/devkit';
import { dirname, join, relative } from 'path';

export interface BuildExecutorSchema {
  tsconfig: string;
  config: string;
}

// process.env.HARDHAT_CONFIG = join(root, hardhatConfig);
// process.env.HARDHAT_TSCONFIG = join(root, tsconfig);
export function runTask(task: string) {
  return createBuilder(async (options: BuildExecutorSchema, context: BuilderContext): Promise<BuilderOutput> => {
    const projectName = context.target?.project;
    if (!projectName) throw new Error('No project found');
    const projectPath = dirname(options.config);
    // We need to run hardhat in the project path
    const cwd = join(context.workspaceRoot, projectPath);
    // Remove the project path from the args if it exists
    const args = Object.entries(options)
      .map(([key, value]: [string, string]) => `--${key} ${relative(projectPath, value)}`)
      .join(' ');
    return execute(context, cwd, `hardhat ngeth:${task} ${args}`);
  });
}
