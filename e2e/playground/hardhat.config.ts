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
    type: 'angular',
    outDir: './src/app/contracts',
    withImports: false,
    autoDeploy: {
      ERC1155Factory: [],
      BaseERC1155: ['uri'],
      BaseERC20: [],
      BaseERC721: [],
    },
    explorer: {
      api: 3000,
      app: 3001
    }
  },
};
