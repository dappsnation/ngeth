import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { provider } from "../provider";
import { TokenBalance, TokenSupply } from "./types";

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
    const blockTag = parseInt(tag, 10);
    balance = await contract.callStatic.balanceOf(address, { blockTag });
  }
  return balance.toString();
}