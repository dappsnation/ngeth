import { Tree, convertNxGenerator, names, getWorkspaceLayout, readWorkspaceConfiguration, addDependenciesToPackageJson, addProjectConfiguration, updateProjectConfiguration, getWorkspacePath, readJson, joinPathFragments, Workspace, ProjectConfiguration, TargetConfiguration } from '@nrwl/devkit';
import { setProjectTargets, updateTsConfig } from '@ngeth/devkit';


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


export async function nxGenerator(tree: Tree, baseOptions: BaseOptions) {
  const options = getOptions(tree, baseOptions);
  updateTsConfig(tree, options, { skipLibCheck: true, });
  setProjectTargets(tree, options.projectName, {
    'ipfs-daemon': {
      executor: '@ngeth/ipfs:daemon',
      options: {
        path: '.ipfs',
      }
    }
  })

  const installTask = addDependenciesToPackageJson(tree, {
    // '@ngeth/ipfs': '0.0.1',
    'ipfs': "^0.62.0",
  }, {});

  return () => installTask();
}

export const ngSchematic = convertNxGenerator(nxGenerator);