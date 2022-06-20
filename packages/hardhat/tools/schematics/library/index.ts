import { getProjectOptions, addFiles } from '@ngeth/devkit';
import { Tree, addProjectConfiguration, formatFiles } from '@nrwl/devkit';
import { HardhatOptions, installHardhatDeps } from '../utils';

function hardhatTarget(root: string, task: 'build' | 'serve' | 'test') {
  const tsconfig = task === 'test'
    ? `${root}/tsconfig.spec.json`
    : `${root}/tsconfig.lib.json`;
  return {
    executor: `@ngeth/hardhat:${task}`,
    options: {
      config: `${root}/hardhat.config.ts`,
      tsconfig,
    }
  }
}


export default async function (tree: Tree, baseOptions: HardhatOptions) {
  const options = getProjectOptions(tree, baseOptions.project);
  addProjectConfiguration(tree, options.project, {
    root: options.projectRoot,
    projectType: 'library',
    sourceRoot: `${options.projectRoot}/src`,
    targets: {
      build: hardhatTarget(options.projectRoot, 'build'),
      serve: hardhatTarget(options.projectRoot, 'serve'),
      test: hardhatTarget(options.projectRoot, 'test'),
    },
    tags: [],
  });
  addFiles(tree, options, __dirname);
  await formatFiles(tree);
  return installHardhatDeps(tree, baseOptions);
}
