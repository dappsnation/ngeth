import { Contract } from "@ethersproject/contracts";
import { Interface } from "@ethersproject/abi";
import { provider } from "../provider";
import { TokenBalance, TokenSupply } from "./types";

const ERC20 = new Interface([
  "function totalSupply() view returns (uint)",
  "function balanceOf(address owner) view returns (uint)"
]);

export function tokenSupply({ contractaddress }: TokenSupply) {
  const contract = new Contract(contractaddress, ERC20, provider);
  return contract.callStatic.totalSupply();
}

export function tokenBalance({ contractaddress, address, tag }: TokenBalance) {
  console.log('start');
  const contract = new Contract(contractaddress, ERC20, provider);
  if (!tag || tag === 'latest') return contract.callStatic.balanceOf(address);
  const blockTag = parseInt(tag, 10);
  return contract.callStatic.balanceOf(address, { blockTag });
}