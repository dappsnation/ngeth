import hre from 'hardhat';
import { saveAddresses } from '@ngeth/hardhat';
import { BaseERC1155Factory, BaseERC20Factory } from '../contracts'
console.log('Hi, I am a script test');


async function deploy() {
  const erc20Factory = new BaseERC20Factory();
  const erc1155Factory = new BaseERC1155Factory();
  const [ erc20, erc1155 ] = await Promise.all([
    erc20Factory.deploy('name'),
    erc1155Factory.deploy('uri'),
  ]);
  await Promise.all([
    erc20.deployed(),
    erc1155.deployed()
  ]);
  await saveAddresses(hre, {
    erc20: erc1155.address,
    erc1155: erc1155.address,
  });
}

deploy();