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
        `generate @nxeth/plugin:plugin ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/contracts/ERC20.sol`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--build-contracts', () => {
    it('should compile contract', async () => {
      try {
        await runNxCommandAsync(`generate @nxeth/plugin:plugin ${plugin}`);
        await runNxCommandAsync(`build ${plugin}`);
        expect(true);
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
