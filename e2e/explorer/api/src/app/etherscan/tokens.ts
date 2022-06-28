import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { provider } from "../provider";
import { TokenBalance, TokenSupply, TokenSupplyHistory, TokenBalanceHistory, TokenInfo, GetParams } from "@ngeth/etherscan";
import { store } from "../store";
import { ERC1155Account, ERC20Account, ERC721Account } from "@explorer";
import { Artifact } from "hardhat/types";

const ERC20 = new Interface([
  "function totalSupply() view returns (uint)",
  "function balanceOf(address owner) view returns (uint)"
]);

export async function tokenSupply({ contractaddress }: TokenSupply) {
  const contract = new Contract(contractaddress, ERC20, provider);
  const supply: BigNumber = await contract.callStatic.totalSupply();
  return supply.toString();
}

export async function tokenBalance({ contractaddress, address, tag }: TokenBalance) {
  const contract = new Contract(contractaddress, ERC20, provider);
  let balance: BigNumber;
  if (!tag || tag === 'latest') {
    balance = await contract.callStatic.balanceOf(address);
  } else {
    const blockNumber = tag === 'earliest' ? 0 : parseInt(tag, 16);
    balance = store.states[blockNumber].erc20[address]?.[contractaddress] ?? BigNumber.from(0);
  }
  return balance.toString();
}

export function tokenSupplyHistory({ contractaddress, blockno }: TokenSupplyHistory) {
  let balance = BigNumber.from(0);
  for (const address in store.states[blockno].erc20) {
    const userBalance = store.states[blockno].erc20[address]?.[contractaddress];
    if (userBalance) balance = balance.add(userBalance);
    balance = balance.add(userBalance);
  }
  return balance.toString();
}

export function tokenBalanceHistoy({ contractaddress, address, blockno }: TokenBalanceHistory) {
  const balance = store.states[blockno].erc20[address]?.[contractaddress] ?? BigNumber.from(0);
  return balance.toString();
}

export async function tokenInfo(params: GetParams<TokenInfo>) {
  if(!params.contractaddress) throw new Error("Error! Missing Contract Address");
  const tokenMedias = {
    blueCheckmark: "",
    description:"",
    website:"",
    email:"",
    blog:"",
    reddit:"",
    slack:"",
    facebook:"",
    twitter:"",
    bitcointalk:"",
    github:"",
    telegram:"",
    wechat:"",
    linkedin:"",
    discord:"",
    whitepaper:"",
    tokenPriceUSD:"",
  }

  if(store.artifacts[params.contractaddress].standard === "ERC20") {
    const metadatas = (store.addresses[params.contractaddress] as ERC20Account).metadata;
    return {
      contractAddress: params.contractaddress,
      tokenName: metadatas.name,
      symbol: metadatas.symbol,
      divisor: metadatas.decimals.toString(),
      tokenType: "ERC20",
      totalSupply: metadatas.totalSupply.toString(),
      ...tokenMedias,
    }
  } else if (store.artifacts[params.contractaddress].standard === "ERC721") {
    const metadatas = (store.addresses[params.contractaddress] as ERC721Account).metadata;
    return {
      contractAddress: params.contractaddress,
      tokenName: metadatas.name,
      symbol: metadatas.symbol,
      divisor: metadatas.decimals.toString(),
      tokenType: "ERC721",
      totalSupply: "0",
      ...tokenMedias,
    }
  } else if (store.artifacts[params.contractaddress].standard === "ERC1155") {
    const metadatas = (store.addresses[params.contractaddress] as ERC1155Account).metadata;
    return {
      contractAddress: params.contractaddress,
      tokenName: metadatas.name,
      symbol: metadatas.symbol,
      divisor: metadatas.decimals.toString(),
      tokenType: "ERC1155",
      totalSupply: "0",
      ...tokenMedias,
    }
  }
}