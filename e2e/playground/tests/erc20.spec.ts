/** @jest-environment node */
// Use above comment to avoid "setImmediate is not defined"
// It must be the first line
import { ethers } from "hardhat";

describe('erc20', () => {
  test('Supply', async () => {
    const [owner] = await ethers.getSigners();
  
    const Token: any = await ethers.getContractFactory('BaseERC20');
  
    const hardhatToken = await Token.deploy();
  
    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    const supply = await hardhatToken.totalSupply();
    expect(supply).toEqual(ownerBalance);
  })
})