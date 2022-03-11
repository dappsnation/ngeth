import { join, resolve } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import * as prettier from 'prettier';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getContract } from './generate';


const common = `import { NgContract } from 'ngeth';
import type { EventFilter, Signer, Event } from 'ethers';
import type { Listener, Provider, BlockTag } from "@ethersproject/providers";
import type { Observable } from 'rxjs';

export type FilterParam<T> = T | T[] | null;
export interface TypedFilter<T> extends EventFilter {}


export type EventArgs<T extends ContractEvents<any, any>, K extends keyof T['filters']> = Parameters<T['events'][K]> & T['queries'][K];
export interface TypedEvent<T extends ContractEvents<any, any>, K extends keyof T['filters']> extends Event {
  args: EventArgs<T, K>;
}

interface ContractEvents<EventKeys extends string, FilterKeys extends string> {
  events: {[name in EventKeys]: Listener; }
  filters: {[name in FilterKeys]: (...args: any[]) => TypedFilter<name>; }
  queries: {[name in FilterKeys]: any }
}

export class TypedContract<
  Events extends ContractEvents<EventKeys, FilterKeys>,
  EventKeys extends Extract<keyof Events['events'], string> = Extract<keyof Events['events'], string>,
  FilterKeys extends Extract<keyof Events['filters'], string> = Extract<keyof Events['filters'], string>,
> extends NgContract {
  override attach!: (addressOrName: string) => typeof this;
  override connect!: (providerOrSigner: Provider | Signer) => typeof this;
  deloyed?: () => Promise<typeof this>;
  
  // Events
  override listenerCount!: (eventName?: EventFilter | EventKeys) => number;
  override listeners!: <K extends EventKeys>(eventName?: TypedFilter<K> | K) => Listener[];
  override off!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override on!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override once!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override removeListener!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events['events'][K]) => this;
  override removeAllListeners!: (eventName?: EventFilter | EventKeys) => this;
  
  // FILTERS
  override filters!: Events['filters'];
  override queryFilter!: <K extends FilterKeys>(
    event: TypedFilter<K>,
    fromBlockOrBlockhash?: BlockTag,
    toBlock?: BlockTag,
  ) => Promise<TypedEvent<Events, K>[]>;

  // Observable
  override from!: <K extends FilterKeys>(event: TypedFilter<K> | K) => Observable<EventArgs<Events, K>[]>;
}
`;



export async function getContractNames(hre: HardhatRuntimeEnvironment) {
  const allNames = await hre.artifacts.getAllFullyQualifiedNames();
  const src = resolve(hre.config.paths.sources);
  return allNames.filter((name) => resolve(name).startsWith(src));
}

export async function generate(hre: HardhatRuntimeEnvironment) {
  const names = await getContractNames(hre);
  if (!names.length) return;

  const src = resolve('src');
  if (!existsSync(src)) mkdirSync(src);

  const folder = join(src, 'contracts');
  if (!existsSync(folder)) mkdirSync(folder);

  const commonPath = join(folder, 'common.ts');
  fs.writeFile(commonPath, common);

  const allContracts: string[] = [];
  for (const name of names) {
    const { contractName, abi, bytecode } = await hre.artifacts.readArtifact(
      name
    );
    allContracts.push(contractName);

    const contract = getContract(contractName, abi);
    const code = prettier.format(contract, {
      parser: 'typescript',
      printWidth: 120,
    });
    const path = join(folder, `${contractName}.ts`);
    fs.writeFile(path, code);
  }
  // index.ts
  const exportAll = allContracts
    .map((name) => `export * from "./contracts/${name}";`)
    .join('\n');
  fs.writeFile(join(src, 'index.ts'), exportAll);
}