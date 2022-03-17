import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
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
};
