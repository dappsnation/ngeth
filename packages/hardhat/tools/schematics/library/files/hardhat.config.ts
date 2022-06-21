import '@nomiclabs/hardhat-ethers';
import '@ngeth/hardhat';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: '0.8.11',
  paths: {
    sources: './contracts',
    tests: './tests',
    artifacts: './artifacts'
  },
  ngeth: {
    outputPath: './src',
    runs: ['scripts/deploy.ts'],
    explorer: {
      api: 3000,
      app: 3001
    },
  }
};
