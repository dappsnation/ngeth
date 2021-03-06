import '@nomiclabs/hardhat-ethers';
import '@ngeth/hardhat';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: '0.8.14',
  paths: {
    sources: './contracts',
    tests: './tests',
    artifacts: './artifacts',
  },
  ngeth: {
    outputPath: './src/app/contracts',
    withImports: false,
    runs: ['scripts/deploy.ts'],
    explorer: {
      api: 3000,
      app: 3001
    },
  },
};
