import { Tree, convertNxGenerator, addDependenciesToPackageJson } from '@nrwl/devkit';
import { addFiles, getProjectOptions, updateTsConfig } from '@ngeth/devkit';


interface BaseOptions {
  project?: string;
}

export async function nxGenerator(tree: Tree, baseOptions: BaseOptions) {
  const options = getProjectOptions(tree, baseOptions.project);
  await addFiles(tree, options);
  updateTsConfig(tree, options, config => {
    if (!config.references) config.references = [];
    config.references.push({ path: './tsconfig.hardhat.json' });
    return config;
  })
  const installTask = addDependenciesToPackageJson(tree, {
    "ethers": "^5.5.3"
  }, {
    "@nomiclabs/hardhat-ethers": "^2.0.4",
    "@nrwl/workspace": "13.4.6",
    "@openzeppelin/contracts": "^4.4.2",
    "hardhat": "^2.8.3",
    "ts-node": "^10.4.0",
  });

  return () => installTask();
}

export const ngSchematic = convertNxGenerator(nxGenerator);