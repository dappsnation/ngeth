import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { provider } from "../provider";
import { TokenBalance, TokenSupply, TokenSupplyHistory, TokenBalanceHistory, TokenInfo } from "./types";
import { store } from "../store";

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

export async function tokenInfo(params: TokenInfo) {
  throw { message: 'API not supported by Hardhat node', params };
}