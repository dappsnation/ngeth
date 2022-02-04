import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('plugin e2e', () => {
  let plugin: string;
  beforeEach(() => {
    plugin = uniq('plugin');
    ensureNxProject('@nxeth/plugin', 'dist/packages/plugin');
  })

  describe('--contracts', () => {
    it('should create contract in the specified directory', async () => {
      await runNxCommandAsync(
        `generate @nxeth/plugin:library ${plugin} --directory subdir`
      );
      const checkFile = (path: string) => {
        expect(() => checkFilesExist(path)).not.toThrow();
      }
      checkFile(`libs/subdir/${plugin}/contracts/ERC20.sol`);
      checkFile(`libs/subdir/${plugin}/environments/environment.ts`);
    }, 120000);
  });

  describe('--build-contracts', () => {
    it('should compile contract', async () => {
      try {
        await runNxCommandAsync(`generate @nxeth/plugin:library ${plugin}`);
        expect(async () => await runNxCommandAsync(`build ${plugin}`)).not.toThrow()
      } catch(err) {
        expect(false);
      }
    }, 120000);
  })


  describe.skip('--package', () => {
    it('should have the right packages', async () => {

    });
  })
});
