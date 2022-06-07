import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { execute } from '@ngeth/devkit';
import { dirname, join, relative } from 'path';

export interface BuildExecutorSchema {
  tsconfig: string;
  config: string;
  showStackTraces: boolean;
}

function formatArgs(options: BuildExecutorSchema) {
  const projectPath = dirname(options.config);
  const format = (_key: string, value: any) => {
    if (value === undefined || value === null) return '';
    // Arguments should be lowercase, except show-stack-traces
    const key = _key === 'showStackTraces' ? 'show-stack-traces' : _key.toLowerCase();
    if (value === true) return `--${key}`;
    if (value === false) return '';
    // We need to run hardhat in the project path
    // Remove the project path from the args if it exists
    if (typeof value === 'string') return `--${key} ${relative(projectPath, value)}`;
    return `--${key} ${value}`;
  } 

  return Object.entries(options)
    .map(([key, value]) => format(key, value))
    .join(' ');
}

// process.env.HARDHAT_CONFIG = join(root, hardhatConfig);
// process.env.HARDHAT_TSCONFIG = join(root, tsconfig);
export function runTask(task: string) {
  return createBuilder(async (options: BuildExecutorSchema, context: BuilderContext): Promise<BuilderOutput> => {
    const projectName = context.target?.project;
    if (!projectName) throw new Error('No project found');
    const cwd = join(context.workspaceRoot, dirname(options.config));
    const args = formatArgs(options);
    return execute(context, `hardhat ngeth:${task} ${args}`, { cwd });
  });
}
