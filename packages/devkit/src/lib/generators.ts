import { getWorkspacePath, joinPathFragments, names, ProjectConfiguration, readJson, readWorkspaceConfiguration, TargetConfiguration, Tree, updateJson, Workspace } from '@nrwl/devkit';

///////////
// UTILS //
///////////
export function getProjectName(tree: Tree, project?: string) {
  const projectName = project ?? readWorkspaceConfiguration(tree).defaultProject;
  if (!projectName) throw new Error('No project provided');
  const name = names(projectName).fileName;
  return name.replace(new RegExp('/', 'g'), '-');
}



/////////////
// PROJECT //
/////////////

interface NgProjectConfig extends ProjectConfiguration {
  architect: Record<string, TargetConfiguration>
}
type WorkspaceOrProject = Workspace | ProjectConfiguration;
function isProjectConfig(workspace: WorkspaceOrProject): workspace is ProjectConfiguration {
  return 'projectType' in workspace;
}
function isNgProjectConfig(config: ProjectConfiguration | NgProjectConfig): config is NgProjectConfig {
  return 'architect' in config;
}


export function readRawWorkspaceJson(tree: Tree) {
  const path = getWorkspacePath(tree);
  if (!path) throw new Error('No file angular.json or workspace.json found');
  if (!tree.exists(path)) throw new Error(`No file ${path} found`);
  return readJson<Workspace>(tree, path);
}

export function getProjectFileLocation(tree: Tree, project: string): string | null {
  const rawWorkspace = readRawWorkspaceJson(tree);
  const projectConfig = rawWorkspace.projects?.[project];
  if (!projectConfig) return null;
  return typeof projectConfig === 'string'
    ? joinPathFragments(projectConfig, 'project.json')
    : getWorkspacePath(tree);
}

export function projectConfig(workspace: WorkspaceOrProject, project: string): ProjectConfiguration {
  if (isProjectConfig(workspace)) return workspace;
  return workspace.projects[project];
}

export function getProjectConfig(tree: Tree, project: string) {
  const projectFile = getProjectFileLocation(tree, project);
  if (!projectFile) throw new Error(`Could not find config file of project "${project}"`);
  const workspace = readJson(tree, projectFile);
  return projectConfig(workspace, project);
}


export function updateProjectConfig(tree: Tree, project: string, cb: (config: ProjectConfiguration) => void) {
  const projectFile = getProjectFileLocation(tree, project);
  if (!projectFile) throw new Error('Could not find project file');
  return updateJson(tree, projectFile, (file: WorkspaceOrProject) => {
    const config = projectConfig(file, project);
    if (!config) return file;
    cb(config);
    return file;
  });
}


export function setProjectBuilders(tree: Tree, project: string, targets: Record<string, TargetConfiguration>) {
  return updateProjectConfig(tree, project, config => {
    // Angular
    if (isNgProjectConfig(config)) {
      for (const [key, value] of Object.entries(targets)) {
        config['architect'][key] = value;
      }
      return;
    }
    // Nx
    if (!config.targets) {
      config.targets = targets;
    } else {
      for (const [key, value] of Object.entries(targets)) {
        config.targets[key] = value;
      }
    }
  })
}




//////////////
// TSCONFIG //
//////////////
export function getTsconfigPath(tree: Tree, project: string) {
  const config = getProjectConfig(tree, project);
  return `${config.root}/tsconfig.json`;
}

export function updateTsConfig(tree: Tree, project: string, updates: Record<string, any>) {
  const tsConfig = getTsconfigPath(tree, project);

  updateJson(tree, tsConfig, json => {
    if (!json.compilerOptions) json.compilerOptions = {};
    for (const [key, value] of Object.entries(updates)) {
      json.compilerOptions[key] = value;
    }
    return json;
  })
}



////////////////
// GIT_IGNORE //
////////////////
export function updateGitIgnore(tree: Tree, text: string) {
  const file = '.gitignore';
  if (!tree.exists(file)) return;
  const content = tree.read(file)?.toString('utf-8');
  if (!content) return;
  if (content.includes(text)) return;
  tree.write(file, `${content}\n\n${text}`);
}