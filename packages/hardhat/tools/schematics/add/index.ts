import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { addFiles, BuilderConfiguration, getProjectOptions, ProjectOptions, setProjectBuilders, updateTsConfig } from '@ngeth/devkit';
import { HardhatOptions, installHardhatDeps } from '../utils';

function hardhatBuilder(tasks: string[], options: ProjectOptions) {
  const builders: Record<string, BuilderConfiguration> = {};
  for (const task of tasks) {
    builders[`hardhat-${task}`] = {
      options: {
        config: `${options.projectRoot}/hardhat.config.ts`,
        tsconfig: `${options.projectRoot}/tsconfig.hardhat.json`,
      }
    }
    if (options.isAngular) {
      builders[`hardhat-${task}`].builder = `@ngeth/hardhat:${task}`;
    } else {
      builders[`hardhat-${task}`].executor = `@ngeth/hardhat:${task}`;
    }
  }
  return builders;
}

export async function nxGenerator(tree: Tree, baseOptions: HardhatOptions) {
  const options = getProjectOptions(tree, baseOptions.project);
  await addFiles(tree, options, __dirname);
  setProjectBuilders(tree, options, hardhatBuilder(['build', 'serve', 'test'], options));
  updateTsConfig(tree, options, (config) => {
    if (!config.compilerOptions) config.compilerOptions = {};
    config.compilerOptions.resolveJsonModule = true;
    // update references only there is one already ??? (nx project)
    if (!config.references) return config;
    config.references.push({ path: './tsconfig.hardhat.json' });
    return config;
  });
  return installHardhatDeps(tree, baseOptions);
}

export const ngSchematic = convertNxGenerator(nxGenerator);
