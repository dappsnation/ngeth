import "@nomiclabs/hardhat-ethers";


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.2",
  paths: {
    sources: "./contracts",
    tests: "./tests",
    artifacts: "./artifacts"
  },
};
