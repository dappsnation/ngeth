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
  const options = getProjectOptions(tree, baseOptions.project);
  await addFiles(tree, options, __dirname);
  updateTsConfig(tree, options, (config) => {
    if (!config.references) config.references = [];
    config.references.push({ path: './tsconfig.hardhat.json' });
    return config;
  });
  const installTask = addDependenciesToPackageJson(
    tree,
    {
      "ethers": "^5.6.0",
    },
    {
      "@ngeth/ethers": "0.0.7",
      "@ngeth/hardhat": "0.0.7",
      "@nomiclabs/hardhat-ethers": "^2.0.5",
      "hardhat": "^2.9.0",
      "prettier": "^2.6.0",
      "ts-node": "^10.7.0",
    }
  );

  return () => installTask();
}

export const ngSchematic = convertNxGenerator(nxGenerator);
