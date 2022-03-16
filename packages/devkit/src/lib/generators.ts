import { formatFiles, generateFiles, getWorkspacePath, joinPathFragments, names, offsetFromRoot, ProjectConfiguration as NxProjectConfig, readJson, readWorkspaceConfiguration, TargetConfiguration, Tree, updateJson, Workspace } from '@nrwl/devkit';
import { join } from 'path';


/////////////
// PROJECT //
/////////////
// Project with angular config
interface ProjectConfig extends NxProjectConfig {
  architect: Record<string, TargetConfiguration>
}


export interface ProjectOptions {
  project: string;
  projectConfig: ProjectConfig;
  projectConfigLocation: string;
}

type WorkspaceOrProject = Workspace | ProjectConfig;
function isProjectConfig(workspace: WorkspaceOrProject): workspace is ProjectConfig {
  return 'projectType' in workspace;
}
function isNxProjectConfig(config: ProjectConfig | NxProjectConfig): config is NxProjectConfig {
  return !('architect' in config);
}



export function readRawWorkspaceJson(tree: Tree) {
  const path = getWorkspacePath(tree);
  if (!path) throw new Error('No file angular.json or workspace.json found');
  if (!tree.exists(path)) throw new Error(`No file ${path} found`);
  return readJson<Workspace>(tree, path);
}

export function getProjectOptions(tree: Tree, projectName?: string): ProjectOptions {
  const workspace = readRawWorkspaceJson(tree);
  const project = projectName ?? workspace.defaultProject;
  if (!project) throw new Error('No project provided');
  const config = workspace.projects[project];
  if (!config) throw new Error('No config found for project');
  // project.json
  if (typeof config === 'string') {
    return {
      project,
      projectConfig: readJson(tree, config),
      projectConfigLocation: joinPathFragments(config, 'project.json'),
    }
  } else {
    return {
      project,
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
  return updateJson(tree, options.projectConfigLocation, (file: WorkspaceOrProject) => {
    const config = projectConfig(file, options.project);
    if (!config) return file;
    cb(config);
    return file;
  });
}


export function setProjectBuilders(tree: Tree, options: ProjectOptions, targets: Record<string, TargetConfiguration>) {
  return updateProjectConfig(tree, options, config => {
    // Nx
    if (isNxProjectConfig(config)) {
      if (!config.targets) {
        config.targets = targets;
      } else {
        for (const [key, value] of Object.entries(targets)) {
          config.targets[key] = value;
        }
      }
    }
    // Angular
    for (const [key, value] of Object.entries(targets)) {
      config['architect'][key] = value;
    }
    return;
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
  const tsConfig = `${options.projectConfig.root}/tsconfig.json`;
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
export async function addFiles(tree: Tree, options: ProjectOptions) {
  const templateOptions = {
    ...options,
    ...names(options.project),
    offset: offsetFromRoot(options.projectConfig.root),
    tmpl: '',
  };
  generateFiles(
    tree,
    join(__dirname, 'files'),
    options.projectConfig.root,
    templateOptions
  );
  await formatFiles(tree);
}