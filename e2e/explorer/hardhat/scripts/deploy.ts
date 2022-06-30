import * as hre from 'hardhat';
import { saveAddresses } from '@ngeth/hardhat';
import { BaseERC1155Factory, BaseERC20Factory, ERC1155ProxyFactory } from '../contracts'

async function main() {
  console.log('Start Deploying');
  const [signer] = await hre.ethers.getSigners();
  const erc20Factory = new BaseERC20Factory(signer);
  const erc1155Factory = new BaseERC1155Factory(signer);
  const eRC1155ProxyFactory = new ERC1155ProxyFactory(signer);
  const [ erc20, erc1155, erc1155Proxy ] = await Promise.all([
    erc20Factory.deploy('name').then(c => c.deployed()),
    erc1155Factory.deploy('uri').then(c => c.deployed()),
    eRC1155ProxyFactory.deploy().then(c => c.deployed()),
  ]);
  await saveAddresses(hre, {
    erc20: erc20.address,
    erc1155: erc1155.address,
    erc1155Proxy: erc1155Proxy.address,
  });
  console.log('Address saved.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
