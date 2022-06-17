import * as hre from 'hardhat';
import { deploy, saveAddresses } from '@ngeth/hardhat';

deploy(hre, {
  ERC1155Factory: [],
  BaseERC1155: ['uri'],
  BaseERC20: [],
  BaseERC721: [],
}).then(addresses => saveAddresses(hre, addresses))