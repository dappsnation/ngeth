import { existsSync, mkdirSync, promises as fs } from "fs";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { join } from "path";

/**
 * Deploy a list of contract with their constructor arguments
 * @param hre The hardhat environment
 * @param constructors A record of contract to deploy. The values are the constructor arguments
 * @returns A record with the addresses of the contract deployed
 * @exemple 
 * ```typescript
 * const addresses = await deploy(hre, {
 *   ERC20: ['MyToken', 'SYB']
 * });
 * await saveAddresses(hre, addresses);
 * ```
 */
export async function deploy(
  hre: HardhatRuntimeEnvironment,
  constructors: Record<string, unknown[]>,
) {
  const paths = await hre.artifacts.getAllFullyQualifiedNames();
  const artifacts = await Promise.all(paths.map(path => hre.artifacts.readArtifact(path)));
  const names = artifacts.map(a => a.contractName);
  
  const addresses: Record<string, string> = {};
  
  for (const name in constructors) {
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
  await Promise.all(Object.entries(constructors).map(deployContract));
  return addresses;
}


/**
 * Save a record of addresses in the directory specified by `hre.ngeth.outputPath`
 * @param hre The hardhat environment
 * @param addresses A record of addresses
 * @example
 * ```typescript
 * const erc20 = await factory.deploy('MyToken', 'SYB');
 * await saveAddresses(hre, {
 *   erc20: erc20.address
 * });
 * ```
 */
export async function saveAddresses(hre: HardhatRuntimeEnvironment, addresses: Record<string, string>) {
  const root = hre.config.paths.root;
  const outputPath = join(root, hre.config.ngeth.outputPath);
  // Create the addresses content
  const addressPath = join(outputPath, 'addresses.json');
  if (existsSync(addressPath)) {
    const result = await fs.readFile(addressPath, 'utf-8');
    const file = JSON.parse(result);
    file.hardhat = addresses;
    const code = JSON.stringify(file);
    await fs.writeFile(addressPath, code);
  } else {
    mkdirSync(outputPath, { recursive: true });
    const code = JSON.stringify({ hardhat: addresses });
    await fs.writeFile(addressPath, code);
  }
  // Update any index.ts files at the same level
  const indexPath = join(outputPath, 'index.ts');
  if (existsSync(indexPath)) {
    const importTxt = `export addresses from './addresses.json';`;
    const index = await fs.readFile(indexPath, 'utf-8');
    if (!index.includes(importTxt)) {
      await fs.writeFile(indexPath, [index, importTxt].join('\n'));
    }
  }
}