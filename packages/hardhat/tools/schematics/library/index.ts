import { getProjectOptions } from '@ngeth/devkit';
import {
  addProjectConfiguration,
  addDependenciesToPackageJson,
  formatFiles,
  Tree,
} from '@nrwl/devkit';
import { BaseOptions, addFiles } from '@ngeth/devkit';


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

interface HardhatLibOptions extends BaseOptions {
  outputType: 'angular' | 'typescript';
}

export default async function (tree: Tree, baseOptions: HardhatLibOptions) {
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
  const deps: Record<string, string> = {
    "ethers": "^5.6.0",
    "@ngeth/ethers-core": "0.0.19"
  };

  if (baseOptions.outputType === 'angular') {
    deps["@ngeth/ethers-angular"] = "0.0.19";
  }

  const devDeps: Record<string, string> = {
    "@ngeth/hardhat": "0.0.19",
    "@nomiclabs/hardhat-ethers": "^2.0.5",
    "hardhat": "^2.9.0",
    "prettier": "^2.6.0",
    "ts-node": "^10.7.0",
    "socket.io": "^4.5.0"
  };
  const installTask = addDependenciesToPackageJson(tree, deps, devDeps);
  return () => installTask();
}
