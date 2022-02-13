import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import type { BaseERC1155 } from '../typechain';

describe("ERC1155 contract", function () {
  let erc1155: BaseERC1155;
  let accounts: string[];
  let owner: string;

  beforeAll(async () => {
    const signers = await ethers.getSigners();
    accounts = signers.map(signer => signer.address);
    owner = accounts[0];
  })

  beforeEach(async () => {
    const ERC1155 = await ethers.getContractFactory("BaseERC1155");
    erc1155 = await ERC1155.deploy('uri');
    await erc1155.deployed()
  })

  it("Deployment should set uri", async () => {
    expect(await erc1155.uri(BigNumber.from('0'))).toBe('uri');
  });

  it('Owner can mint token', async () => {
    const id = BigNumber.from(0);
    const amount = BigNumber.from(100);
    await erc1155.mint(owner, id, amount, '0x00');
    const balance = await erc1155.balanceOf(owner, id);
    expect(balance.toString()).toBe(amount.toString());
  });
});