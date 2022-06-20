import { formatFiles, generateFiles, getWorkspacePath, joinPathFragments, names, offsetFromRoot, ProjectConfiguration as NxProjectConfig, readJson, getWorkspaceLayout, TargetConfiguration, Tree, updateJson, Workspace } from '@nrwl/devkit';
import { join } from 'path';


/////////////
// PROJECT //
/////////////
export interface BaseOptions {
  project?: string;
}

// Project with angular config
interface ProjectConfig extends NxProjectConfig {
  architect: Record<string, BuilderConfiguration>
}


export interface ProjectOptions {
  isAngular: boolean;
  project: string;
  projectRoot: string;
  // Only if project exist
  projectConfig?: ProjectConfig;
  projectConfigLocation?: string;
}

export interface BuilderConfiguration extends Omit<TargetConfiguration, 'executor'> {
  executor?: string;
  builder?: string;
}

type WorkspaceOrProject = Workspace | ProjectConfig;
function isProjectConfig(workspace: WorkspaceOrProject): workspace is ProjectConfig {
  return 'projectType' in workspace;
}
function isNgProjectConfig(config: ProjectConfig | NxProjectConfig): config is ProjectConfig {
  return 'architect' in config;
}



export function readRawWorkspaceJson(tree: Tree) {
  const path = getWorkspacePath(tree);
  if (!path) throw new Error('No file angular.json or workspace.json found');
  if (!tree.exists(path)) throw new Error(`No file ${path} found`);
  return readJson<Workspace>(tree, path);
}

export function getProjectOptions(tree: Tree, projectName?: string): ProjectOptions {
  const workspacePath = getWorkspacePath(tree);
  const isAngular = workspacePath === '/angular.json';
  const workspace = readRawWorkspaceJson(tree);
  const project = projectName ? names(projectName).fileName : workspace.defaultProject;
  if (!project) throw new Error('No project provided');
  const config = workspace.projects[project];
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${project}`;
  if (!config) return { isAngular, project, projectRoot };
  // project.json
  if (typeof config === 'string') {
    const projectConfigLocation = joinPathFragments(config, 'project.json');
    const projectConfig = readJson(tree, projectConfigLocation);
    return {
      isAngular,
      project,
      projectRoot: config,
      projectConfig,
      projectConfigLocation: projectConfigLocation,
    }
  } else {
  // workspace.json or angular.json
    return {
      isAngular,
      project,
      projectRoot: config.root,
      projectConfig: config as ProjectConfig,
      projectConfigLocation: getWorkspacePath(tree)!
    }
  }
}



export function projectConfig(workspace: WorkspaceOrProject, project: string): ProjectConfig {
  if (isProjectConfig(workspace)) return workspace;
  return workspace.projects[project] as ProjectConfig;
}


export function updateProjectConfig(tree: Tree, options: ProjectOptions, cb: (config: ProjectConfig) => void) {
  if (!options.projectConfigLocation) {
    throw new Error('Location not found for project: ' + options.project);
  }
  return updateJson(tree, options.projectConfigLocation, (file: WorkspaceOrProject) => {
    const config = projectConfig(file, options.project);
    if (!config) return file;
    cb(config);
    return file;
  });
}


export function setProjectBuilders(tree: Tree, options: ProjectOptions, builders: Record<string, BuilderConfiguration>) {
  return updateProjectConfig(tree, options, (config: ProjectConfig | NxProjectConfig) => {
    // Angular
    if (isNgProjectConfig(config)) {
      for (const [key, value] of Object.entries(builders)) {
        config['architect'][key] = value;
      }
      return;
    }
    // Nx
    const targets = builders as Record<string, TargetConfiguration>;
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
// TODO: find a type for that
interface TsConfig {
  compilerOptions?: {
    skipLibCheck?: boolean;
  },
  references?: { path: string }[];
}


export function updateTsConfig(tree: Tree, options: ProjectOptions, cb: (tsConfig: TsConfig) => TsConfig) {
  const tsConfig = `${options.projectRoot}/tsconfig.json`;
  updateJson(tree, tsConfig, cb);
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


///////////
// FILES //
///////////
export async function addFiles(tree: Tree, options: ProjectOptions, dirname: string) {
  const templateOptions = {
    ...options,
    ...names(options.project),
    offset: offsetFromRoot(options.projectRoot),
    tmpl: '',
  };
  generateFiles(
    tree,
    join(dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
  await formatFiles(tree);
}