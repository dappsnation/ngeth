import { ensureNxProject, runNxCommandAsync, uniq } from "@nrwl/nx-plugin/testing";

describe('IPFS e2e', () => {
  let app: string;
  beforeEach(() => {
    app = uniq('ipfs');
    ensureNxProject('@ngeth/ipfs', 'dist/packages/ipfs');
  });

  describe('--contracts', () => {
    it('should run ipfs', async () => {
      await runNxCommandAsync(`generate @nrwl/angular:app ${app}`);
      expect(true).toBeTruthy();
    }, 120000);
  });
});