import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
import type { BaseERC1155, ERC1155, Market } from '../typechain';

function deploy<T extends Contract>(name: string, ...params: any[]): Promise<T> {
  return  ethers.getContractFactory(name)
  .then(factory => factory.deploy(...params))
  .then(instance => instance.deployed() as Promise<T>);
}

describe('Market Contract', function() {
  let erc1155: BaseERC1155;
  let signers: SignerWithAddress[];
  let account: string;
  let owner: string;
    
  function mint(tokenId: number, amount: number) {
    return erc1155.mint(
      owner,
      BigNumber.from(tokenId),
      BigNumber.from(amount),
      '0x00'
    ).then(tx => tx.wait());
  }

  function approveAll(market: Market) {
    return erc1155.setApprovalForAll(market.address, true).then(tx => tx.wait());
  }

  function upsertOffer(market: Market, tokenId: number, amount: number, price: string) {
    return market.upsertOffer(
      erc1155.address,
      BigNumber.from(tokenId),
      BigNumber.from(amount),
      ethers.utils.parseEther(price),
      '0x00'
    ).then(tx => tx.wait());
  }

  function acceptOffer(market: Market, from: string, to: string, tokenId: number, amount: number, value: string) {
    return market.acceptOffer(
      erc1155.address,
      from,
      account,
      BigNumber.from(tokenId),
      BigNumber.from(amount),
      { value: ethers.utils.parseEther(value) }
    ).then(tx => tx.wait());
  }

  function getOffer(market: Market, from: string, tokenId: number) {
    return market.offers(erc1155.address, from, BigNumber.from(tokenId));
  }


  describe("One market", function () {
    let market: Market;
  
    // Used to avoid beforeEach triggering at every "it"
    async function setup() {
      const contracts = await Promise.all([
        deploy<Market>('Market'),
        deploy<BaseERC1155>('BaseERC1155', 'uri'),
      ]);
      market = contracts[0];
      erc1155 = contracts[1];
    }

    function switchAccount(index: number) {
      erc1155 = erc1155.connect(signers[index]);
      market = market.connect(signers[index]);
      account = signers[index].address;
    }
  
    // ------------------
  
    beforeAll(async () => {
      signers = await ethers.getSigners();
      owner = signers[0].address;
      account = signers[0].address;
    });
  
    it("Market address is defined", async () => {
      await setup();
      expect(market.address).toBeDefined();
    });
  
    it("Should be approved to create an offer", async () => {
      await setup();
      await mint(0, 100);
      await expect(upsertOffer(market, 0, 1, '1.0')).rejects.toThrow('Market contract should be approve for all')
    });
  
    it("Create offer", async () => {
      await setup();
      await mint(0, 100);
      await approveAll(market);
      await upsertOffer(market, 0, 1, '1.0');
      
      const { amount, price } = await getOffer(market, owner, 0);
      expect(amount).toEqual(BigNumber.from(1));
      expect(price).toEqual(ethers.utils.parseEther('1.0'));
      
      const events = await market.queryFilter(market.filters.UpsertOffer(erc1155.address));
      expect(events.length).toBe(1);
      expect(events[0].args.tokenId).toEqual(BigNumber.from(0));
    });
  
    it("Cancel offer", async () => {
      await setup();
      await mint(0, 100);
      await approveAll(market);
      await upsertOffer(market, 0, 1, '1.0');
      await market.cancelOffer(erc1155.address, BigNumber.from(0));
      
      const { amount, price } = await getOffer(market, owner, 0);
      expect(amount).toEqual(BigNumber.from(0));
      expect(price).toEqual(ethers.utils.parseEther('0'));
      // TODO : check event
    });
  
    describe('Accept full offer', () => {
      let ownerBalance: BigNumber;
  
      beforeAll(async () => {
        await setup();
        await mint(0, 1);
        await approveAll(market);
        await upsertOffer(market, 0, 1, '1.0');
        ownerBalance = await signers[0].getBalance();
        switchAccount(1);
        await acceptOffer(market, owner, account, 0, 1, '1.0');
      });
  
      it('Offer should be deleted', async () => {
        const { amount, price } = await getOffer(market, owner, 0);
        expect(amount).toEqual(BigNumber.from(0));
        expect(price).toEqual(BigNumber.from(0));
      });
  
      it('Owner is paid', async () => {
        const newBalance = await signers[0].getBalance();
        expect(newBalance.sub(ownerBalance)).toEqual(ethers.utils.parseEther('1.0'));
      });
  
      it('Token has been transfered', async () => {
        const [ ownerTokenBalance, buyerTokenBalance ] = await Promise.all([
          erc1155.balanceOf(owner, BigNumber.from(0)),
          erc1155.balanceOf(account, BigNumber.from(0)),
        ]);
        expect(ownerTokenBalance).toEqual(BigNumber.from(0));
        expect(buyerTokenBalance).toEqual(BigNumber.from(1));
      });
    });
  
    describe('Accept partial offer', () => {
  
      beforeAll(async () => {
        await setup();
        await mint(0, 2);
        await approveAll(market);
        await upsertOffer(market, 0, 2, '1.0');
        switchAccount(1);
        await acceptOffer(market, owner, account, 0, 1, '1.0');
      });
  
      it('Offer should be updated', async () => {
        const { amount, price } = await getOffer(market, owner, 0);
        expect(amount).toEqual(BigNumber.from(1));  
        expect(price).toEqual(ethers.utils.parseEther('1.0'));
      });
  
      it('Token has been transfered', async () => {
        const [ ownerTokenBalance, buyerTokenBalance ] = await Promise.all([
          erc1155.balanceOf(owner, BigNumber.from(0)),
          erc1155.balanceOf(account, BigNumber.from(0)),
        ]);
        expect(ownerTokenBalance).toEqual(BigNumber.from(1));
        expect(buyerTokenBalance).toEqual(BigNumber.from(1));
      });
    });
  });
  
  
  
  describe('Two markets', () => {
    let markets: Market[];
    

    function switchAccount(index: number) {
      erc1155 = erc1155.connect(signers[index]);
      markets = markets.map(market => market.connect(signers[index]));
      account = signers[index].address;
    }

    beforeAll(async () => {
      signers = await ethers.getSigners();
      owner = signers[0].address;
      account = signers[0].address;
    });
  
    beforeEach(async () => {
      const [market1, market2, token] = await Promise.all([
        deploy<Market>('Market'),
        deploy<Market>('Market'),
        deploy<BaseERC1155>('BaseERC1155', 'uri'),
      ]);
      markets = [ market1, market2 ];
      erc1155 = token;
      await Promise.all([
        approveAll(markets[0]),
        approveAll(markets[1])
      ]);
    })
  
    it('Can create same offer on two markets', async () => {
      await mint(0, 1);
      await Promise.all([
        upsertOffer(markets[0], 0, 1, '1.0'),
        upsertOffer(markets[1], 0, 1, '1.0')
      ]);
      const offers = await Promise.all([
        getOffer(markets[0], owner, 0),
        getOffer(markets[1], owner, 0),
      ]);
      expect(offers[0].amount).toEqual(BigNumber.from(1));
      expect(offers[1].amount).toEqual(BigNumber.from(1));
    });

    it('Can buy from two markets if there is supply', async () => {
      await mint(0, 2);
      await Promise.all([
        upsertOffer(markets[0], 0, 1, '1.0'),
        upsertOffer(markets[1], 0, 1, '1.0')
      ]);
      switchAccount(1);
      await acceptOffer(markets[0], owner, account, 0, 1, '1.0');
      await acceptOffer(markets[1], owner, account, 0, 1, '1.0');
      const [ ownerTokenBalance, buyerTokenBalance ] = await Promise.all([
        erc1155.balanceOf(owner, BigNumber.from(0)),
        erc1155.balanceOf(account, BigNumber.from(0)),
      ]);
      expect(ownerTokenBalance).toEqual(BigNumber.from(0));
      expect(buyerTokenBalance).toEqual(BigNumber.from(2));
    });

    it('Cannot buy from two markets it no supply', async () => {
      await mint(0, 1);
      await Promise.all([
        upsertOffer(markets[0], 0, 1, '1.0'),
        upsertOffer(markets[1], 0, 1, '1.0')
      ]);
      switchAccount(1);
      await acceptOffer(markets[0], owner, account, 0, 1, '1.0');
      expect(acceptOffer(markets[1], owner, account, 0, 1, '1.0')).rejects.toThrow();
    });
  })
})
