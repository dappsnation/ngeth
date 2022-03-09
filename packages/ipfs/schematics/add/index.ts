import { updateJson, Tree, convertNxGenerator, names, getWorkspaceLayout, readWorkspaceConfiguration, addDependenciesToPackageJson, addProjectConfiguration, updateProjectConfiguration, getWorkspacePath, readJson, joinPathFragments, Workspace, ProjectConfiguration, TargetConfiguration } from '@nrwl/devkit';

type WorkspaceOrProject = Workspace | ProjectConfiguration;
function isProjectConfig(workspace: WorkspaceOrProject): workspace is ProjectConfiguration {
  return 'projectType' in workspace;
}

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

export function updateTsConfig(tree: Tree, options: { projectRoot: string }, updates: Record<string, any>) {
  const tsConfig = `${options.projectRoot}/tsconfig.json`;

  updateJson(tree, tsConfig, json => {
    if (!json.compilerOptions) json.compilerOptions = {};
    for (const [key, value] of Object.entries(updates)) {
      json.compilerOptions[key] = value;
    }
    return json;
  })
}

export function readRawWorkspaceJson(tree: Tree) {
  const path = getWorkspacePath(tree);
  if (!path) throw new Error('No file angular.json or workspace.json found');
  if (!tree.exists(path)) throw new Error(`No file ${path} found`);
  return readJson<{ projects: Record<string, any> }>(tree, path);
}

export function getProjectFileLocation(tree: Tree, project: string): string | null {
  const rawWorkspace = readRawWorkspaceJson(tree);
  const projectConfig = rawWorkspace.projects?.[project];
  return typeof projectConfig === 'string'
    ? joinPathFragments(projectConfig, 'project.json')
    : null;
}

export function getProjectConfig(workspace: WorkspaceOrProject, project: string): ProjectConfiguration {
  if (isProjectConfig(workspace)) return workspace;
  return workspace.projects[project];
}

export function updateProjectConfig(tree: Tree, project: string, cb: (config: ProjectConfiguration) => void) {
  const projectFile = getProjectFileLocation(tree, project);
  if (!projectFile) throw new Error('Could not find project file');
  return updateJson(tree, projectFile, (file: WorkspaceOrProject) => {
    const config = getProjectConfig(file, project);
    if (!config) return file;
    cb(config);
    return file;
  });
}

export function setProjectTargets(tree: Tree, project: string, targets: Record<string, TargetConfiguration>) {
  return updateProjectConfig(tree, project, config => {
    if (!config.targets) {
      config.targets = targets;
    } else {
      for (const [key, value] of Object.entries(targets)) {
        config.targets[key] = value;
      }
    }
  })
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