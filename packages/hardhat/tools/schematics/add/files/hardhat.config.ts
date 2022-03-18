import '@nomiclabs/hardhat-ethers';
import '@ngeth/hardhat';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: '0.8.0',
  paths: {
    sources: './contracts',
    tests: './tests',
    artifacts: './artifacts'
  },
  ngeth: {
    outDir: './src/app/contracts',
    // Put the contracts you want to auto deploy here
    // - key is the name of the contract
    // - value is the constructor arguments
    autoDeploy: {
      ['<%= className %>']: ['<%= className %>', '<%= constantName %>']
    }
  }
};
