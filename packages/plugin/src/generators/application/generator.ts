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
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
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
    tmpl: '',
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
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/contracts`,
    targets: {
      build: {
        executor: '@nrwl/workspace:run-commands',
        options: {
          command: 'npx hardhat compile --tsconfig tsconfig.app.json',
          cwd: normalizedOptions.projectRoot
        }
      },
      serve: {
        executor: '@nrwl/workspace:run-commands',
        options: {
          command: 'npx hardhat node --tsconfig tsconfig.app.json',
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
    "@typechain/ethers-v5": "^7.2.0",
    "@typechain/hardhat": "^2.3.1",
    "hardhat": "^2.8.3",
    "typechain": "^5.2.0",
    "ts-node": "^10.4.0",
  });
  return () => installTask();
}
