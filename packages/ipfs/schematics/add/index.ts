import { updateJson, Tree, convertNxGenerator, names, getWorkspaceLayout, readWorkspaceConfiguration, addDependenciesToPackageJson, addProjectConfiguration, updateProjectConfiguration } from '@nrwl/devkit';

interface BaseOptions {
  project?: string;
}

interface Options {
  projectName: string;
  projectRoot: string;
}

function getOptions(tree: Tree, baseOptions: BaseOptions): Options {
  const project = baseOptions.project ?? readWorkspaceConfiguration(tree).defaultProject;
  if (!project) throw new Error('No project provided');
  const name = names(project).fileName;
  return {
    ...baseOptions,
    projectName: name.replace(new RegExp('/', 'g'), '-'),
    projectRoot: `${getWorkspaceLayout(tree).appsDir}/${name}`,
  };
}

function updateTsConfig(tree: Tree, options: { projectRoot: string }, updates: Record<string, any>) {
  const tsConfig = `${options.projectRoot}/tsconfig.json`;

  updateJson(tree, tsConfig, json => {
    if (!json.compilerOptions) json.compilerOptions = {};
    for (const [key, value] of Object.entries(updates)) {
      json.compilerOptions[key] = value;
    }
    return json;
  })
}


export async function nxGenerator(tree: Tree, baseOptions: BaseOptions) {
  const options = getOptions(tree, baseOptions);
  updateTsConfig(tree, options, { skipLibCheck: true, });

  updateProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    targets: {
      'ipfs-daemon': {
        executor: '@ngeth/ipfs:daemon',
        options: {
          path: '.ipfs',
        }
      }
    }
  });

  const installTask = addDependenciesToPackageJson(tree, {
    '@ngeth/ipfs': '0.0.1',
    'ipfs': "^0.62.0",
  }, {});

  return () => installTask();
}

export const ngSchematic = convertNxGenerator(nxGenerator);