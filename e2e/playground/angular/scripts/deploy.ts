import * as hre from 'hardhat';
import { deploy, saveAddresses } from '@ngeth/hardhat';

async function main() {
  const addresses = await deploy(hre, {
    ERC1155Factory: [],
    BaseERC1155: ['uri'],
    BaseERC20: [],
    BaseERC721: [],
  });
  await saveAddresses(hre, addresses);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });