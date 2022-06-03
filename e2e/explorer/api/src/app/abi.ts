import { ABIDescription } from "@type/solc";

export const abis: Record<string, ABIDescription[]> = {};

export function setABI(address: string, abi: ABIDescription[]) {
  abis[address] = abi;
}