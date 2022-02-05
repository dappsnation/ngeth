import { join, resolve } from "path";
import { existsSync, mkdirSync, promises as fs} from "fs";
import * as prettier from 'prettier';
import { HardhatRuntimeEnvironment } from "hardhat/types";


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
  | string // Fallback

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
  type?: 'function' | 'constructor' | 'fallback'
  /** The name of the function. Constructor and fallback functions never have a name */
  name?: string
  /** List of parameters of the method. Fallback functions don’t have inputs. */
  inputs?: ABIParameter[]
  /** List of the output parameters for the method, if any */
  outputs?: ABIParameter[]
  /** State mutability of the method */
  stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable'
  /** true if function accepts Ether, false otherwise. Default is false */
  payable?: boolean
  /** true if function is either pure or view, false otherwise. Default is false  */
  constant?: boolean
}

export interface EventDescription {
  type: 'event'
  name: string
  inputs: (ABIParameter &
    {
      /** true if the field is part of the log’s topics, false if it one of the log’s data segment. */
      indexed: boolean
    })[]
  /** true if the event was declared as anonymous. */
  anonymous: boolean
}

export type ABIDescription = FunctionDescription | EventDescription;

interface EventRecord {
  [eventName: string]: string;
}

interface ContractTemplate {
  contractName: string;
  abi: ABIDescription[];
  calls: string[];
  methods: string[];
  deploy?: string;
  events: EventRecord;
  filters: EventRecord;
  structs: string;
}


// COMMON //

const common = `import { NgContract } from 'ngeth';
import type { EventFilter, Signer, Event } from 'ethers';
import type { Listener, Provider, BlockTag } from "@ethersproject/providers";
import type { Observable } from 'rxjs';

export type FilterParam<T> = T | T[] | null;
export interface TypedFilter<T> extends EventFilter {}
export interface TypedEvent<T extends (...args: any[]) => any> extends Event {
  args: Parameters<T>;
}
type ContractEvents<keys extends string> = {[name in keys]: Listener; };
type ContractFilters<keys extends string> = {[name in keys]: (...args: any[]) => TypedFilter<name>; };

export class TypedContract<
  Events extends ContractEvents<EventKeys>,
  Filters extends ContractFilters<EventKeys>,
  EventKeys extends Extract<keyof Events, string> = Extract<keyof Events, string>
> extends NgContract {
  override attach!: (addressOrName: string) => typeof this;
  override connect!: (providerOrSigner: Provider | Signer) => typeof this;
  deloyed?: () => Promise<typeof this>;

  // Observable
  override from!: <K extends EventKeys>(event: TypedFilter<K> | K) => Observable<Parameters<Events[K]>>;
  
  // Events
  override listenerCount!: (eventName?: EventFilter | EventKeys) => number;
  override listeners!: <K extends EventKeys>(eventName?: TypedFilter<K> | K) => Listener[];
  override off!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events[K]) => this;
  override on!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events[K]) => this;
  override once!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events[K]) => this;
  override removeListener!: <K extends EventKeys>(eventName: TypedFilter<K> | K, listener: Events[K]) => this;
  override removeAllListeners!: (eventName?: EventFilter | EventKeys) => this;
  
  // FILTERS
  override filters!: Filters;
  override queryFilter!: <K extends EventKeys>(
    event: TypedFilter<K>,
    fromBlockOrBlockhash?: BlockTag,
    toBlock?: BlockTag,
  ) => Promise<TypedEvent<Events[K]>[]>
}
`

export async function getContractNames(hre: HardhatRuntimeEnvironment) {
  const allNames = await hre.artifacts.getAllFullyQualifiedNames();
  const src = resolve(hre.config.paths.sources);
  return allNames.filter(name => resolve(name).startsWith(src));
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
    const { contractName, abi, bytecode } = await hre.artifacts.readArtifact(name);
    allContracts.push(contractName);
    let deploy;
    const calls: string[] = [];
    const methods: string[] = [];
    const events: EventRecord = {};
    const filters: EventRecord = {};
    const structs = getAllStructs(abi)
    for (const node of abi as ABIDescription[]) {
      if (node.type === "event") {
        events[node.name] = `(${getParams(node.inputs)}) => void`;
        filters[node.name] = `(${getFilterParams(node)}) => TypedFilter<"${node.name}">`
      } else {
        if (node.type === "constructor") {
          deploy = getDeploy(contractName, node.inputs);
        } else if (node.type === "function") {
          if (node.stateMutability === "view" || node.stateMutability === "pure") {
            calls.push(getCall(node));
          } else {
            methods.push(getMethod(node));
          }
        }
      }
    }
    const contract = getContract({ contractName, calls, methods, deploy, events, filters, structs, abi });
    const code = prettier.format(contract, { parser: 'typescript', printWidth: 120 });
    const path = join(folder, `${contractName}.ts`);
    fs.writeFile(path, code);
  }
  // index.ts
  const exportAll = allContracts.map(name => `export * from "./contracts/${name}";`).join('\n');
  fs.writeFile(join(src, "index.ts"), exportAll);
}


const getOutputs = (outputs: ABIParameter[] = []) => {
  if (!outputs.length) return "";
  if (outputs.length === 1) return getType(outputs[0]);
  return `[${outputs.map(getType)}]`;
}
const getParams = (params: ABIParameter[] = []) => params.map(getParam).join(", ");
const getParam = (param: ABIParameter) => `${param.name || 'arg'}: ${getType(param)}`;
const getType = (param: ABIParameter): string => {
  const type = param.type;
  if (type.endsWith("]")) return getArray(param);
  if (type === "tuple") return getStructName(param.internalType);
  if (type === "string") return "string";
  if (type === "address") return "string";
  if (type === "bool") return "boolean";
  if (type.startsWith("bytes")) return "string";
  if (type.startsWith("uint")) return "BigNumber";
  if (type.startsWith("int")) return "BigNumber";
  return "";
}

const getArray = (param: ABIParameter) => {
  const [type, end] = param.type.split('[');
  const amountString = end.substring(0, end.length - 1); // Remove last "]"
  const amount = parseInt(amountString);
  const itemType = getType({ ...param, type });
  if (!isNaN(amount)) {
    return `[${new Array(amount).fill(itemType).join(', ')}]`;
  } else {
    return `${itemType}[]`;
  }
}

// STRUCT //

/** "struct ContractName.StructName" => "StructName" */ 
const getStructName = (internalType: string) => internalType.split(' ')[1].split('.').pop();
const getStruct = (name: string, fields: ABIParameter[]) => {
  return `interface ${name} {
    ${fields.map(getParam).join('\n')}
  }`
}
const getAllStructs = (abi: ABIDescription[]) => {
  const record: Record<string, string> = {};
  const getAllParams = (description: ABIDescription) => {
    if (description.type === 'event') return description.inputs;
    if (description.outputs) return description.outputs.concat(description.inputs)
    return description.inputs || [];
  }
  const tuples = abi.map(getAllParams).flat().filter(node => node.type === 'tuple');
  for (const tuple of tuples) {
    const name = getStructName(tuple.internalType);
    if (!record[name]) record[name] = getStruct(name, tuple.components);
  }
  return Object.values(record).join('\n');
}


// CALLS //

const getCalls = (calls: string[]) => {
  if (!calls.length) return '';
  return `// Calls
  ${calls.join('\n')}`
}

const getCall = (call: FunctionDescription) => {
  const params = call.inputs.map(getParam).concat('overrides?: CallOverrides').join(', ');
  const output = getOutputs(call.outputs);
  return `${call.name}!: (${params}) => Promise<${output}>`;
}

// METHODS //

const getMethods = (methods: string[]) => {
  if (!methods.length) return '';
  return `// Methods
  ${methods.join('\n')}`
}

const getMethod = (method: FunctionDescription) => {
  const override = method.stateMutability === 'payable' ? 'PayableOverrides' : 'Overrides';
  const params = method.inputs.map(getParam).concat(`overrides?: ${override}`).join(', ');
  return `${method.name}!: (${params}) => Promise<TransactionResponse>`;
}

// EVENTS //
const getEventFields = (events: EventRecord) => {
  const entries = Object.entries(events);
  if (!entries.length) return '';
  return entries.map(([ event, listener ]) => `${event}: ${listener}`).join(';\n');
}


// FILTERS //
const getFilterFields = (filters: EventRecord) => {
  const entries = Object.entries(filters);
  if (!entries.length) return '';
  return entries.map(([ filter, listener ]) => `${filter}: ${listener}`).join(';\n');
}
const getFilterParams = (node: EventDescription) => {
  return node.inputs.filter(input => input.indexed).map(input => {
    return `${input.name}?: FilterParam<${getType(input)}>`;
  }).join(", ");
}


// CONTRACT //

const getContract = ({ abi, contractName, structs, calls, methods, events, filters }: ContractTemplate) => `
import { TypedContract, FilterParam, TypedFilter } from './common';
import { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer } from "ethers";
import { Provider, TransactionResponse } from '@ethersproject/providers';
import env from '../../environments/environment';

interface ${contractName}Events {
  ${getEventFields(events)}
}
interface ${contractName}Filters {
  ${getFilterFields(filters)}
}

${structs}

export const abi = ${JSON.stringify(abi)};

export class ${contractName} extends TypedContract<${contractName}Events, ${contractName}Filters> {
  
  ${getCalls(calls)}

  ${getMethods(methods)}

  override filters!: ${contractName}Filters;

  constructor(signer?: Signer | Provider) {
    super(env.addresses.${contractName}, abi, signer);
  }
}
`;



// FACTORY //
const getDeploy = (contractName: string, inputs: ABIParameter[] = []) => {
  const params = inputs.map(getParam).concat('overrides?: PayableOverrides').join(', ');
  return `deploy(${params}): Promise<${contractName}> {
    return super.deploy(...arguments);
  }`;
}