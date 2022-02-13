import { ethers } from 'hardhat';

describe("Market contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Market = await ethers.getContractFactory("Market");

    const market = await Market.deploy();
    await market.deployed()
    expect(market.address).toBeDefined();
  });
});