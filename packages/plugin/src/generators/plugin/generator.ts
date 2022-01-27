import {
  addProjectConfiguration,
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { PluginGeneratorSchema } from './schema';

interface NormalizedSchema extends PluginGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: PluginGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offset: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (tree: Tree, options: PluginGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/contracts`,
    targets: {
      build: {
        executor: '@nrwl/workspace:run-commands',
        options: {
          command: 'hardhat compile',
          cwd: normalizedOptions.projectRoot
        }
      },
      test: {
        executor: '@nxeth/plugin:test',
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
  const installTask = addDependenciesToPackageJson(tree, {
    "ethers": "^5.5.3"
  }, {
    "@nomiclabs/hardhat-ethers": "^2.0.4",
    "@nrwl/workspace": "13.4.6",
    "@openzeppelin/contracts": "^4.4.2",
    "@typechain/hardhat": "", 
    "@typechain/ethers-v5": "",
    "typechain": "",
    "hardhat": "^2.8.3",
  });
  return () => installTask();
}
