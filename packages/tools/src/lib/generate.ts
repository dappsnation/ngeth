/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ABIDescription, ABIParameter, EventDescription, FunctionDescription } from './types';
import * as parserTypeScript from "prettier/parser-typescript";
import * as prettier from "prettier/standalone";


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



const getOutputs = (outputs: ABIParameter[] = []) => {
  if (!outputs.length) return 'void';
  if (outputs.length === 1) return getType(outputs[0], 'output');
  return `[${outputs.map((output) => getType(output, 'output'))}]`;
};
const getParams = (params: ABIParameter[] = []) => params.map(getParam).join(', ');
const getParam = (param: ABIParameter, index: number) => {
  if (param.name) return `${param.name}: ${getType(param, 'input')}`;
  if (!index) return `arg: ${getType(param, 'input')}`;
  return `arg${index}: ${getType(param, 'input')}`;
}
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
  return `['${name}']!: (${params}) => Promise<${output}>`;
};

const getCall = (call: FunctionDescription) => {
  const name = call.name!;
  const inputs = call.inputs || [];
  const params = inputs
    .map(getParam)
    .concat('overrides?: CallOverrides')
    .join(', ');
  const output = getOutputs(call.outputs);
  return `${name}!: (${params}) => Promise<${output}>;`;
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
  return `['${name}']!: (${params}) => Promise<ContractTransaction>;`;
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
  return `${name}!: (${params}) => Promise<ContractTransaction>;`;
};

// EVENTS //
const getAllEvents = (nodes: EventDescription[]) => {
  if (!nodes.length) return '';
  const record: Record<string, string[]> = {};
  for (const node of nodes) {
    if (!record[node.name]) record[node.name] = [];
    record[node.name].push(getEvent(node));
  }
  const events = Object.entries(record)
    .map(([name, type]) => `${name}: ${getOverloadType(type)}`)
    .join('\n');
  if (events) return `{ ${events} }`;
  return 'never';
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
  const filters = Object.entries(record)
    .map(([name, type]) => `${name}: ${getOverloadType(type)}`)
    .join('\n');
  if (filters) return `{ ${filters} }`;
  return 'never';
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
  const queries = Object.entries(record)
    .map(([name, type]) => `${name}: ${getOverloadType(type)}`)
    .join('\n');
  if (queries) return `{ ${queries} }`;
  return 'never';
};

const getQuery = (node: EventDescription) => {
  const fields = node.inputs
    .map((input) => `${input.name}: ${getType(input, 'output')}`)
    .join(', ');
  return `{ ${fields} }`;
};

// CONTRACT //

export const getContract = (contractName: string, abi: ABIDescription[]) => {
  const deploy = abi.find(isConstrutor);
  const calls: FunctionDescription[] = abi.filter(isCall);
  const methods: FunctionDescription[] = abi.filter(isMethod);
  const events: EventDescription[] = abi.filter(isEvent);
  const structs = getAllStructs(abi);

  const code = `
  import { NgContract, FilterParam, TypedFilter } from '@ngeth/ethers';
  import { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer, ContractTransaction, BytesLike, BigNumberish } from "ethers";
  import { Provider } from '@ethersproject/providers';
  
  export interface ${contractName}Events {
    events: ${getAllEvents(events)},
    filters: ${getAllFilters(events)},
    queries: ${getAllQueries(events)}
  }
  
  ${structs}
  
  export class ${contractName} extends NgContract<${contractName}Events> {
    // Read
    ${getAllCalls(calls)}

    // Write
    ${getAllMethods(methods)}

    constructor(address: string, signer?: Signer | Provider) {
      super(address, ${contractName}_abi, signer);
    }
  }

  export const ${contractName}_abi = ${JSON.stringify(abi)};`;
  return prettier.format(code, {
    parser: 'typescript',
    plugins: [parserTypeScript],
    printWidth: 120,
  });
}

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
