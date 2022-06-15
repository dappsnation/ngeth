import '@nomiclabs/hardhat-ethers';
import '@ngeth/hardhat';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: '0.8.11',
  paths: {
    sources: './src',
    tests: './tests',
    artifacts: './artifacts',
  },
  ngeth: {
    outDir: './contracts',
    explorer: false,
    exec: {
      scripts: ['scripts/deploy.ts'],
      parallel: true
    }
  },
};
