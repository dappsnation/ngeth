import '@nomiclabs/hardhat-ethers';
import '@ngeth/hardhat';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  paths: {
    sources: './src',
    tests: './tests',
    artifacts: './artifacts',
  },
  solidity: {
    version: '0.8.11',
    settings: {
      outputSelection: { "*": { "*": [ "*" ], "": [ "*" ] } }
    },
  },
  ngeth: {
    outputPath: './contracts',
    withImports: true,
    explorer: false,
    runs: {
      scripts: ['scripts/deploy.ts'],
      parallel: true
    }
  },
};
