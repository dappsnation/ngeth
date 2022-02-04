const { join } = require('path');
const path = join(__dirname, './tmp/nx-e2e/proj/libs/plugin2740955/hardhat.config.ts');
process.env.HARDHAT_CONFIG = path;
const hre = require('hardhat');
hre.run('compile');