import { ABIDescription } from "@type/solc";

// TODO with Camille
// const isERC20(abi: ABIDescription[]) {

// } 

export const abis: Record<string, ABIDescription[]> = {};

export function setABI(address: string, abi: ABIDescription[]) {
  abis[address] = abi;
}