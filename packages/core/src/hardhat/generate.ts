/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { join, resolve } from 'path';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import * as prettier from 'prettier';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// TYPES //

export type ABITypeParameter =
  | 'uint'
  | 'uint[]' // TODO : add <M>
  | 'int'
  | 'int[]' // TODO : add <M>
  | 'address'
  | 'address[]'
  | 'bool'
  | 'bool[]'
  | 'fixed'
  | 'fixed[]' // TODO : add <M>
  | 'ufixed'
  | 'ufixed[]' // TODO : add <M>
  | 'bytes'
  | 'bytes[]' // TODO : add <M>
  | 'function'
  | 'function[]'
  | 'tuple'
  | 'tuple[]'
  | string; // Fallback

export interface ABIParameter {
  /** The name of the parameter */
  name: string;
  /** The canonical type of the parameter */
  type: ABITypeParameter;
  /** Used for tuple types */
  components?: ABIParameter[];
  /**
   * @example "struct StructName"
   * @example "struct Contract.StructName"
   */
  internalType?: string;
}

export interface FunctionDescription {
  /** Type of the method. default is 'function' */
  type?: 'function' | 'constructor' | 'fallback';
  /** The name of the function. Constructor and fallback functions never have a name */
  name?: string;
  /** List of parameters of the method. Fallback functions don’t have inputs. */
  inputs?: ABIParameter[];
  /** List of the output parameters for the method, if any */
  outputs?: ABIParameter[];
  /** State mutability of the method */
  stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
  /** true if function accepts Ether, false otherwise. Default is false */
  payable?: boolean;
  /** true if function is either pure or view, false otherwise. Default is false  */
  constant?: boolean;
}

export interface EventDescription {
  type: 'event';
  name: string;
  inputs: (ABIParameter & {
    /** true if the field is part of the log’s topics, false if it one of the log’s data segment. */
    indexed: boolean;
  })[];
  /** true if the event was declared as anonymous. */
  anonymous: boolean;
}

export type ABIDescription = FunctionDescription | EventDescription;

interface EventRecord {
  [eventName: string]: string;
}

interface ContractTemplate {
  contractName: string;
  abi: ABIDescription[];
  deploy?: FunctionDescription;
  calls: FunctionDescription[];
  methods: FunctionDescription[];
  events: EventDescription[];
  structs: string;
}

// COMMON //

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

function isEvent(node: ABIDescription): node is EventDescription {
  return node.type === 'event';
}
function isCall(node: ABIDescription): node is FunctionDescription {
  return (
    node.type === 'function' &&
    (node.stateMutability === 'view' || node.stateMutability === 'pure')
  );
}
function isMethod(node: ABIDescription): node is FunctionDescription {
  return (
    node.type === 'function' &&
    (node.stateMutability === 'nonpayable' ||
      node.stateMutability === 'payable')
  );
}
function isConstrutor(node: ABIDescription): node is FunctionDescription {
  return node.type === 'constructor';
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
    const deploy = abi.find(isConstrutor);
    const calls: FunctionDescription[] = abi.filter(isCall);
    const methods: FunctionDescription[] = abi.filter(isMethod);
    const events: EventDescription[] = abi.filter(isEvent);
    const structs = getAllStructs(abi);
    const contract = getContract({
      contractName,
      calls,
      methods,
      deploy,
      events,
      structs,
      abi,
    });
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

const getOutputs = (outputs: ABIParameter[] = []) => {
  if (!outputs.length) return 'void';
  if (outputs.length === 1) return getType(outputs[0], 'output');
  return `[${outputs.map((output) => getType(output, 'output'))}]`;
};
const getParams = (params: ABIParameter[] = []) =>
  params.map(getParam).join(', ');
const getParam = (param: ABIParameter) =>
  `${param.name || 'arg'}: ${getType(param, 'input')}`;
const getType = (param: ABIParameter, kind: 'input' | 'output'): string => {
  const type = param.type;
  if (type.endsWith(']')) return getArray(param, kind);
  if (type === 'tuple') return getStructName(param.internalType!);
  if (type === 'string') return 'string';
  if (type === 'address') return 'string';
  if (type === 'bool') return 'boolean';
  if (type.startsWith('bytes')) return 'BytesLike';
  if (type.startsWith('uint'))
    return kind === 'input' ? 'BigNumberish' : 'BigNumber';
  if (type.startsWith('int'))
    return kind === 'input' ? 'BigNumberish' : 'BigNumber';
  return '';
};

const getOverrides = (description: FunctionDescription) => {
  if (description.stateMutability === 'payable') return 'PayableOverrides';
  if (description.stateMutability === 'nonpayable') return 'Overrides';
  return 'CallOverrides';
};

const getSuperCall = (name: string) =>
  `return this.functions['${name}'](...arguments);`;

const getArray = (param: ABIParameter, kind: 'input' | 'output') => {
  const [type, end] = param.type.split('[');
  const amountString = end.substring(0, end.length - 1); // Remove last "]"
  const amount = parseInt(amountString);
  const itemType = getType({ ...param, type }, kind);
  if (!isNaN(amount)) {
    return `[${new Array(amount).fill(itemType).join(', ')}]`;
  } else {
    return `${itemType}[]`;
  }
};

/** Enable overload methods */
const getOverloadType = (types: string[]) => {
  if (types.length === 1) return types[0];
  return types.map((type) => `(${type})`).join(' | ');
};

// const getOverload = (nodes: FunctionDescription[], isMethod = false) => {
//   const maxSize = Math.max(...nodes.map(node => node.inputs.length));
//   const outputs = isMethod
//     ? 'ContractTransaction'
//     : Array.from(new Set(nodes.map(node => node.outputs).map(getOutputs).map(o => o || 'void'))).join(' | ');
//   const inputs: (ABIParameter[] | undefined)[] = [];
//   const first = nodes[0];
//   const overrides = getOverrides(first);
//   // Get all inputs
//   for (let i = 0; i < maxSize; i++) {
//     let type = first.inputs[i]?.type;
//     let isSameType = true;
//     for (const node of nodes) {
//       if (type !== node.inputs[i]?.type) {
//         isSameType = false;
//         break;
//       }
//     }
//     if (isSameType) {
//       inputs.push([ first.inputs[i] ]);
//     } else {
//       inputs.push(nodes.map(node => node.inputs[i]));
//     }
//   }
//   const getParams = (paramList: ABIParameter[]) => {
//     const name = paramList.find(param => param?.name).name;
//     const types = paramList.filter(param => param).map(param => getType(param)).join(' | ');
//     const optional = paramList.some(param => !param);
//     return optional ? `${name}?: ${types} | ${overrides}` : `${name}: ${types}`;
//   }
//   const params = inputs.map(getParams).join(', ');
//   return `${first.name}(${params}, overrides?: ${overrides}): Promise<${outputs || 'void'}> { ${getSuperCall(first.name)} }`;
// }

// STRUCT //

/** "struct ContractName.StructName" => "StructName" */
const getStructName = (internalType: string) =>
  internalType.split(' ')[1].split('.').pop()!;
const getStruct = (name: string, fields: ABIParameter[] = []) => {
  return `interface ${name} {
    ${fields.map(getParam).join('\n')}
  }`;
};
const getAllStructs = (abi: ABIDescription[]) => {
  const record: Record<string, string> = {};
  const getAllParams = (description: ABIDescription) => {
    if (description.type === 'event') return description.inputs;
    if (description.outputs)
      return description.outputs.concat(description.inputs || []);
    return description.inputs || [];
  };
  const tuples = abi
    .map(getAllParams)
    .flat()
    .filter((node) => node.type === 'tuple');
  for (const tuple of tuples) {
    const name = getStructName(tuple.internalType!);
    if (!record[name]) record[name] = getStruct(name, tuple.components);
  }
  return Object.values(record).join('\n');
};

// CALLS //
const getAllCalls = (nodes: FunctionDescription[]) => {
  if (!nodes.length) return '';
  const record: Record<string, FunctionDescription[]> = {};
  for (const node of nodes) {
    if (!node.name) continue; // constructor + fallbacks
    if (!record[node.name]) record[node.name] = [];
    record[node.name].push(node);
  }

  const calls: string[] = [];
  for (const duplicates of Object.values(record)) {
    if (duplicates.length === 1) {
      const node = duplicates[0];
      calls.push(getCall(node));
    } else {
      duplicates.forEach((node) => calls.push(getSignatureCall(node)));
    }
  }

  return calls.join('\n');
};

const getSignatureCall = (call: FunctionDescription) => {
  const inputs = call.inputs || [];
  const name = `${call.name}(${inputs.map((i) => i.type).join()})`;
  const params = inputs
    .map(getParam)
    .concat('overrides?: CallOverrides')
    .join(', ');
  const output = getOutputs(call.outputs);
  return `['${name}'](${params}): Promise<${output}> { ${getSuperCall(name)} }`;
};

const getCall = (call: FunctionDescription) => {
  const name = call.name!;
  const inputs = call.inputs || [];
  const params = inputs
    .map(getParam)
    .concat('overrides?: CallOverrides')
    .join(', ');
  const output = getOutputs(call.outputs);
  return `${name}(${params}): Promise<${output}> { ${getSuperCall(name)} }`;
};

// METHODS //
const getAllMethods = (nodes: FunctionDescription[]) => {
  if (!nodes.length) return '';
  const record: Record<string, FunctionDescription[]> = {};
  for (const node of nodes) {
    if (!node.name) continue; // constructor + fallbacks
    if (!record[node.name]) record[node.name] = [];
    record[node.name].push(node);
  }

  const methods: string[] = [];
  for (const duplicates of Object.values(record)) {
    if (duplicates.length === 0) continue;
    if (duplicates.length === 1) {
      const node = duplicates[0];
      methods.push(getMethod(node));
    } else {
      duplicates.forEach((node) => methods.push(getSignatureMethod(node)));
    }
  }

  return methods.join('\n');
};

const getSignatureMethod = (method: FunctionDescription) => {
  const inputs = method.inputs || [];
  const name = `${method.name}(${inputs.map((i) => i.type).join()})`;
  const override =
    method.stateMutability === 'payable' ? 'PayableOverrides' : 'Overrides';
  const params = inputs
    .map(getParam)
    .concat(`overrides?: ${override}`)
    .join(', ');
  return `['${name}'](${params}): Promise<ContractTransaction> { ${getSuperCall(
    name
  )} }`;
};

const getMethod = (method: FunctionDescription) => {
  const name = method.name!;
  const inputs = method.inputs || [];
  const override =
    method.stateMutability === 'payable' ? 'PayableOverrides' : 'Overrides';
  const params = inputs
    .map(getParam)
    .concat(`overrides?: ${override}`)
    .join(', ');
  return `${name}(${params}): Promise<ContractTransaction> { ${getSuperCall(
    name
  )} }`;
};

// EVENTS //
const getAllEvents = (nodes: EventDescription[]) => {
  if (!nodes.length) return '';
  const record: Record<string, string[]> = {};
  for (const node of nodes) {
    if (!record[node.name]) record[node.name] = [];
    record[node.name].push(getEvent(node));
  }
  return Object.entries(record)
    .map(([name, type]) => `${name}: ${getOverloadType(type)}`)
    .join('\n');
};

const getEvent = (node: EventDescription) => {
  return `(${getParams(node.inputs)}) => void`;
};

// FILTERS //
const getAllFilters = (nodes: EventDescription[]) => {
  if (!nodes.length) return '';
  const record: Record<string, string[]> = {};
  for (const node of nodes) {
    // Only gets indexed events
    if (!node.inputs.some((input) => input.indexed)) continue;
    if (!record[node.name]) record[node.name] = [];
    record[node.name].push(getFilter(node));
  }
  return Object.entries(record)
    .map(([name, type]) => `${name}: ${getOverloadType(type)}`)
    .join('\n');
};

const getFilter = (node: EventDescription) => {
  return `(${getFilterParams(node)}) => TypedFilter<"${node.name}">`;
};

const getFilterParams = (node: EventDescription) => {
  return node.inputs
    .filter((input) => input.indexed)
    .map((input) => `${input.name}?: FilterParam<${getType(input, 'input')}>`)
    .join(', ');
};

// QUERIES //
const getAllQueries = (nodes: EventDescription[]) => {
  if (!nodes.length) return '';
  const record: Record<string, string[]> = {};
  for (const node of nodes) {
    // If there are no indexed events you cannot query it
    if (!node.inputs.some((input) => input.indexed)) continue;
    if (!record[node.name]) record[node.name] = [];
    record[node.name].push(getQuery(node));
  }
  return Object.entries(record)
    .map(([name, type]) => `${name}: ${getOverloadType(type)}`)
    .join('\n');
};

const getQuery = (node: EventDescription) => {
  const fields = node.inputs
    .map((input) => `${input.name}: ${getType(input, 'output')}`)
    .join(', ');
  return `{ ${fields} }`;
};

// CONTRACT //

const getContract = ({
  abi,
  contractName,
  structs,
  calls,
  methods,
  events,
}: ContractTemplate) => `
import { TypedContract, FilterParam, TypedFilter } from './common';
import { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, ContractTransaction, BytesLike, BigNumberish } from "ethers";
import { Provider } from '@ethersproject/providers';
import env from '../../environments/environment';

export interface ${contractName}Events {
  events: {
    ${getAllEvents(events)}
  },
  filters: {
    ${getAllFilters(events)}
  },
  queries: {
    ${getAllQueries(events)}
  }
}

${structs}

export const abi = ${JSON.stringify(abi)};

export class ${contractName} extends TypedContract<${contractName}Events> {
  constructor(signer?: Signer | Provider) {
    super(env.addresses.${contractName}, abi, signer);
  }

  ${getAllCalls(calls)}

  ${getAllMethods(methods)}
}
`;

// FACTORY //
const getDeploy = (contractName: string, inputs: ABIParameter[] = []) => {
  const params = inputs
    .map(getParam)
    .concat('overrides?: PayableOverrides')
    .join(', ');
  return `deploy(${params}): Promise<${contractName}> {
    return super.deploy(...arguments);
  }`;
};
