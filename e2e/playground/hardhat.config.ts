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
    artifacts: './artifacts',
  },
  ngeth: {
    outDir: './src/app/contracts',
    withImports: false,
    autoDeploy: {
      BaseERC1155: ['uri'],
      BaseERC20: [],
      BaseERC721: [],
    },
  },
};
