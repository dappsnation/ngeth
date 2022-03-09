import { Tree, convertNxGenerator, addDependenciesToPackageJson } from '@nrwl/devkit';
import { getProjectName, setProjectBuilders, updateGitIgnore, updateTsConfig } from '@ngeth/devkit';


interface BaseOptions {
  project?: string;
}

export async function nxGenerator(tree: Tree, baseOptions: BaseOptions) {
  const project = getProjectName(tree, baseOptions.project);
  updateTsConfig(tree, project, { skipLibCheck: true, });
  setProjectBuilders(tree, project, {
    'ipfs-daemon': {
      executor: '@ngeth/ipfs:daemon',
      options: {
        path: '.ipfs',
      }
    }
  })
  updateGitIgnore(tree, '# IPFS Data\n.ipfs');
  const installTask = addDependenciesToPackageJson(tree, {
    '@ngeth/ipfs': '0.0.5',
    'ipfs': "^0.62.0",
  }, {
    'ipfsd-ctl': "^10.0.6"
  });

  return () => installTask();
}

export const ngSchematic = convertNxGenerator(nxGenerator);