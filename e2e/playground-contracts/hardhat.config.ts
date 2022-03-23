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
    typechain: './typechain',
  },
  ngeth: {
    outDir: '../playground/src/app/contracts',
    autoDeploy: {
      BaseERC1155: ['uri'],
      BaseERC20: [],
      BaseERC721: [],
    }
  }
};
