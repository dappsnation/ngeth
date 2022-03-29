import { resolve } from "path";

export function getContractNames(allNames: string[], src: string) {
  return allNames.filter((name) => resolve(name).startsWith(src));
}

export function getContractImportNames(allNames: string[], src: string) {  
  return allNames.filter((name) => !resolve(name).startsWith(src));
}
