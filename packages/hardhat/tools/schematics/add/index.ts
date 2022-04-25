import {
  Tree,
  convertNxGenerator,
  addDependenciesToPackageJson,
  TargetConfiguration,
} from '@nrwl/devkit';
import { addFiles, getProjectOptions, ProjectOptions, setProjectBuilders, updateTsConfig } from '@ngeth/devkit';

interface BaseOptions {
  project?: string;
}

function hardhatBuilder(tasks: string[], options: ProjectOptions) {
  const builders: Record<string, TargetConfiguration> = {};
  for (const task of tasks) {
    builders[`hardhat-${task}`] = {
      executor: `@ngeth/hardhat:${task}`,
      options: {
        config: `${options.projectRoot}/hardhat.config.ts`,
        tsconfig: `${options.projectRoot}/tsconfig.hardhat.json`,
      }
    }
  }
  return builders;
}

export async function nxGenerator(tree: Tree, baseOptions: BaseOptions) {
  const options = getProjectOptions(tree, baseOptions.project);
  await addFiles(tree, options, __dirname);
  setProjectBuilders(tree, options, hardhatBuilder(['build', 'serve', 'test'], options));
  updateTsConfig(tree, options, (config) => {
    // update references only there is one already ??? (nx project)
    if (!config.references) return config;
    config.references.push({ path: './tsconfig.hardhat.json' });
    return config;
  });
  const installTask = addDependenciesToPackageJson(
    tree,
    {
      "ethers": "^5.6.0",
    },
    {
      "@ngeth/ethers": "0.0.13",
      "@ngeth/hardhat": "0.0.13",
      "@nomiclabs/hardhat-ethers": "^2.0.5",
      "hardhat": "^2.9.0",
      "prettier": "^2.6.0",
      "ts-node": "^10.7.0",
    }
  );

  return () => installTask();
}

export const ngSchematic = convertNxGenerator(nxGenerator);
