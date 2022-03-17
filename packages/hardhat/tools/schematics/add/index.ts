import {
  Tree,
  convertNxGenerator,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { addFiles, getProjectOptions, updateTsConfig } from '@ngeth/devkit';

interface BaseOptions {
  project?: string;
}

export async function nxGenerator(tree: Tree, baseOptions: BaseOptions) {
  console.log({ baseOptions });
  const options = getProjectOptions(tree, baseOptions.project);
  console.log({options});
  await addFiles(tree, options);
  updateTsConfig(tree, options, (config) => {
    if (!config.references) config.references = [];
    config.references.push({ path: './tsconfig.hardhat.json' });
    return config;
  });
  const installTask = addDependenciesToPackageJson(
    tree,
    {
      'ethers': '^5.6.0',
    },
    {
      '@nomiclabs/hardhat-ethers': '^2.0.5',
      'hardhat': '^2.9.0',
      'ts-node': '^10.7.0',
    }
  );

  return () => installTask();
}

export const ngSchematic = convertNxGenerator(nxGenerator);
