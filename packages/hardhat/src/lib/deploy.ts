import { existsSync, mkdirSync, promises as fs } from "fs";
import { Artifact, HardhatConfig, HardhatRuntimeEnvironment } from "hardhat/types";
import { formatTs } from './utils';
import { join } from "path";

export async function deploy(hre: HardhatRuntimeEnvironment, artifacts: Artifact[]) {
  const names = artifacts.map(a => a.contractName);
  
  const addresses: Record<string, string> = {};
  const autoDeploy = hre.config.ngeth.autoDeploy;
  
  for (const name in autoDeploy) {
    if (!names.includes(name)) {
      const error = `Contract "${name}" provided in ngeth.autoDeploy is not part of the contracts.`;
      const solution = `The list of available contracts is: [${names.join(', ')}].`;
      throw new Error(`${error} ${solution}`);
    }
  }

  // Deploy
  const deployContract = async ([name, params]: [string, unknown[]]) => {
    const Contract = await (hre as any).ethers.getContractFactory(name);
    const contract = await Contract.deploy(...params);
    await contract.deployed();
    addresses[name] = contract.address;
  };
  await Promise.all(Object.entries(autoDeploy).map(deployContract));

  // Create addresses
  const root = hre.config.paths.root;
  const outDir = join(root, hre.config.ngeth.outDir);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const code = formatTs(`export default ${JSON.stringify(addresses)};`);
  await fs.writeFile(join(outDir, 'addresses.ts'), code);

}


export function saveAddresses(config: HardhatConfig, addresses: Record<string, string>) {
  const root = config.paths.root;
  const outDir = join(root, config.ngeth.outDir);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const code = formatTs(`export default ${JSON.stringify(addresses)};`);
  return fs.writeFile(join(outDir, 'addresses.ts'), code);
}