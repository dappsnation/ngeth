import { BaseOptions } from '@ngeth/devkit';
import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export interface HardhatOptions extends BaseOptions {
  outputType: 'angular' | 'typescript';
}

export function installHardhatDeps(tree: Tree, options: HardhatOptions) {
  const deps: Record<string, string> = {
    "ethers": "^5.6.0",
    "@ngeth/ethers-core": "0.0.19"
  };

  if (options.outputType === 'angular') {
    deps["@ngeth/ethers-angular"] = "0.0.19";
  }

  const devDeps: Record<string, string> = {
    "@ngeth/hardhat": "0.0.19",
    "@nomiclabs/hardhat-ethers": "^2.0.5",
    "hardhat": "^2.9.0",
    "prettier": "^2.6.0",
    "ts-node": "^10.7.0",
    "socket.io": "^4.5.0"
  };
  const installTask = addDependenciesToPackageJson(tree, deps, devDeps);
  return () => installTask();
}