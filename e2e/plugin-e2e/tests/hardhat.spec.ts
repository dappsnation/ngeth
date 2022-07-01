import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('HARDHAT', () => {
  let project: string;
  beforeEach(() => {
    project = uniq('hardhat');
    ensureNxProject('@ngeth/devkit', 'dist/packages/devkit');
    ensureNxProject('@ngeth/hardhat', 'dist/packages/hardhat');
  })

  describe('--add', () => {
    it('should add hardhat config in the specified directory', async () => {
      await runNxCommandAsync(`generate @nrwl/node:application ${project}`);
      await runNxCommandAsync(`generate @ngeth/hardhat:ng-add --project ${project}`);
      const checkFile = (path: string) => {
        expect(() => checkFilesExist(path)).not.toThrow();
      }
      checkFile(`apps/${project}/tsconfig.hardhat.json`);
      checkFile(`apps/${project}/hardhat.config.ts`);
    }, 120000);
  });
  
});
