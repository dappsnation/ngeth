import { ABIDescription, ABIParameter, ABITypeParameter, DeveloperDocumentation, EventDescription, FunctionDescription } from "@type/solc";
import { toJsDoc, toMethodJsDoc } from "./natspec";
import { ExportTypes } from './types';

export interface GenerateConfig {
  natspec?: DeveloperDocumentation;
  abi: ABIDescription[];
}

export interface Config {
  exports: ExportTypes;
  natspec?: DeveloperDocumentation;
}

export function isEvent(node: ABIDescription): node is EventDescription {
  return node.type === 'event';
}
export function isRead(node: ABIDescription): node is FunctionDescription {
  return (
    node.type === 'function' &&
    (node.stateMutability === 'view' || node.stateMutability === 'pure')
  );
}

export function isWrite(node: ABIDescription): node is FunctionDescription {
  return (
    node.type === 'function' &&
    (node.stateMutability === 'nonpayable' ||
      node.stateMutability === 'payable')
  );
}
export function isConstrutor(node: ABIDescription): node is FunctionDescription {
  return node.type === 'constructor';
}



const getOutputs = (outputs: ABIParameter[] = []) => {
  if (!outputs.length) return 'void';
  if (outputs.length === 1) return getType(outputs[0], 'output');
  return `[${outputs.map((output) => getType(output, 'output'))}]`;
};
const getParam = (param: ABIParameter, index: number) => {
  if (param.name) return `${param.name}: ${getType(param, 'input')}`;
  if (!index) return `arg: ${getType(param, 'input')}`;
  return `arg${index}: ${getType(param, 'input')}`;
}
const getType = (param: ABIParameter, kind: 'input' | 'output'): string => {
  const type = param.type;
  if (type.endsWith(']')) return getArray(param, kind);
  if (type === 'tuple') return getStructName(param.internalType) ?? '';
  if (type === 'string') return 'string';
  if (type === 'address') return 'string';
  if (type === 'bool') return 'boolean';
  if (type.startsWith('bytes')) return 'BytesLike';
  if (type.endsWith('int8')) return 'number';
  if (type.endsWith('int16')) return 'number';
  if (type.endsWith('int32')) return 'number';
  if (type.startsWith('uint')) {
    return kind === 'input' ? 'BigNumberish' : 'BigNumber';
  }
  if (type.startsWith('int'))
    return kind === 'input' ? 'BigNumberish' : 'BigNumber';
  return '';
};

// example: "uint[8][][32]" -> ["uint[8]", "[32]"]
function splitArray(type: string) {
  const arrayStart = type.lastIndexOf('[');
  const end = type.substring(arrayStart);
  const radix = type.slice(0, -1 * (type.length - arrayStart));
  return [radix, end] as [ABITypeParameter, string];
}

// Extract amount "[32]" -> 32 / "[]" -> NaN
function getArrayAmount(suffix: string): number {
  const amount = suffix.match(/\[(.*)\]/)?.[1];
  return parseInt(amount ?? '');
}

const getArray = (param: ABIParameter, kind: 'input' | 'output') => {
  const [type, end] = splitArray(param.type);
  const amount = getArrayAmount(end);
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



/////////
// DOC //
/////////
function withDoc(content: string, doc?: string) {
  if (!doc) return content;
  return `${doc}\n${content}`;
}



////////////
// STRUCT //
////////////

/** "struct ContractName.StructName[4][]" => "StructName" */
const getStructName = (internalType?: string) => {
  if (!internalType) return;
  // "struct ContractName.StructName[4][]" => "ContractName.StructName[4][]"
  const [_, path] = internalType.split(' ');
  // "ContractName.StructName[4][]" => "StructName[4][]"
  const type = path.split('.').pop();
  if (!type) return;
  // "StructName[4][]" => "StructName"
  return type.split('[').shift();
}
const getStruct = (name: string, fields: ABIParameter[] = []) => {
  return `export interface ${name} {
    ${fields.map(getParam).join('\n')}
  }`;
};
export const getAllStructs = (abi: ABIDescription[]) => {
  const record: Record<string, string> = {};
  // Find deep structs
  const getDeepParams = (param: ABIParameter): ABIParameter[] => {
    if (param.components) {
      const children = param.components.map(getDeepParams).flat();
      return children.concat(param);
    }
    return [param];
  }
  const getAllParams = (description: ABIDescription) => {
    if (description.type === 'error') return [];
    if (description.type === 'event') return description.inputs.map(getDeepParams).flat();
    const { inputs = [], outputs = [] } = description;
    return inputs.map(getDeepParams).concat(outputs.map(getDeepParams)).flat();
  };
  const tuples = abi
    .map(getAllParams)
    .flat()
    .filter((node) => node.type.startsWith('tuple'));
  for (const tuple of tuples) {
    const name = getStructName(tuple.internalType);
    if (!name) continue;
    if (!record[name]) record[name] = getStruct(name, tuple.components);
  }
  return Object.values(record).join('\n');
};

///////////
// READS //
///////////
export function signatureName(node: FunctionDescription | EventDescription) {
  const inputs = node.inputs || [];
  return `${node.name}(${inputs.map((i) => i.type).join()})`;
}

const getSignatureCall = (call: FunctionDescription, config: Config) => {
  const { exports } = config;
  const inputs = call.inputs || [];
  const name = signatureName(call);
  const params = inputs
    .map(getParam)
    .concat('overrides?: CallOverrides')
    .join(', ');
  const output = getOutputs(call.outputs);
  if (exports === 'class') return `['${name}']!: (${params}) => Promise<${output}>`;
  return `['${name}']: (${params}) => Promise<${output}>`;
};

const getCall = (call: FunctionDescription, config: Config) => {
  const { exports } = config;
  const name = call.name!;
  const inputs = call.inputs || [];
  const doc = toMethodJsDoc(config.natspec?.methods?.[signatureName(call)]);
  const params = inputs
    .map(getParam)
    .concat('overrides?: CallOverrides')
    .join(', ');
  const output = getOutputs(call.outputs);
  if (exports === 'class') return withDoc(`${name}!: (${params}) => Promise<${output}>;`, doc);
  return withDoc(`${name}: (${params}) => Promise<${output}>;`, doc);
};

/**
 * @param nodes Thie ABI function description
 * @param exports If we plan to export to a class or an interface
 */
 export const getAllCalls = (nodes: FunctionDescription[], config: Config) => {
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
      calls.push(getCall(node, config));
    } else {
      duplicates.forEach((node) => calls.push(getSignatureCall(node, config)));
    }
  }

  return calls.join('\n');
};

////////////
// WRITES //
////////////

const getSignatureMethod = (method: FunctionDescription, config: Config) => {
  const { exports } = config;
  const inputs = method.inputs || [];
  const name = `${method.name}(${inputs.map((i) => i.type).join()})`;
  const override = method.stateMutability === 'payable' ? 'PayableOverrides' : 'Overrides';
  const params = inputs
    .map(getParam)
    .concat(`overrides?: ${override}`)
    .join(', ');
  if (exports === 'class') return `['${name}']!: (${params}) => Promise<ContractTransaction>;`;
  return `['${name}']: (${params}) => Promise<ContractTransaction>;`;
};

const getMethod = (method: FunctionDescription, config: Config) => {
  const { exports } = config;
  const name = method.name!;
  const inputs = method.inputs || [];
  const doc = toMethodJsDoc(config.natspec?.methods?.[signatureName(method)]);
  const override = method.stateMutability === 'payable' ? 'PayableOverrides' : 'Overrides';
  const params = inputs
    .map(getParam)
    .concat(`overrides?: ${override}`)
    .join(', ');
    if (exports === 'class') return withDoc(`${name}!: (${params}) => Promise<ContractTransaction>;`, doc);
    return withDoc(`${name}: (${params}) => Promise<ContractTransaction>;`, doc);
};

export const getAllMethods = (nodes: FunctionDescription[], config: Config) => {
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
      methods.push(getMethod(node, config));
    } else {
      duplicates.forEach((node) => methods.push(getSignatureMethod(node, config)));
    }
  }

  return methods.join('\n');
};

////////////
// EVENTS //
////////////
export const getAllEvents = (nodes: EventDescription[], config: Config) => {
  if (!nodes.length) return 'never';
  const record: Record<string, EventDescription[]> = {};
  for (const node of nodes) {
    if (!record[node.name]) record[node.name] = [];
    record[node.name].push(node);
  }
  const events = Object.entries(record)
    .map(([name, eventNodes]) => {
      const types = eventNodes.map(getEvent);
      const doc = toMethodJsDoc(config.natspec?.events?.[signatureName(eventNodes[0])]);
      return withDoc(`${name}: ${getOverloadType(types)}`, doc);
    })
    .join('\n');
  if (events) return `{ ${events} }`;
  return 'never';
};

const getEvent = (node: EventDescription) => {
  return `(${getEventParams(node.inputs)}) => void`;
};

const getEventParams = (params: ABIParameter[] = []) => params.map(getEventParam).join(', ');
const getEventParam = (param: ABIParameter, index: number) => {
  if (param.name) return `${param.name}: ${getType(param, 'output')}`;
  if (!index) return `arg: ${getType(param, 'output')}`;
  return `arg${index}: ${getType(param, 'output')}`;
}


/////////////
// FILTERS //
/////////////

export const getAllFilters = (nodes: EventDescription[], config: Config) => {
  if (!nodes.length) return 'never';
  const record: Record<string, EventDescription[]> = {};
  for (const node of nodes) {
    // Only gets indexed events
    if (!node.inputs.some((input) => input.indexed)) continue;
    if (!record[node.name]) record[node.name] = [];
    record[node.name].push(node);
  }
  const filters = Object.entries(record)
    .map(([name, fitlerNodes]) => {
      const types = fitlerNodes.map(getFilter);
      const doc = toMethodJsDoc(config.natspec?.events?.[signatureName(fitlerNodes[0])]);
      return withDoc(`${name}: ${getOverloadType(types)}`, doc);
    })
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
export const getAllQueries = (nodes: EventDescription[], config: Config) => {
  if (!nodes.length) return 'never';
  const record: Record<string, EventDescription[]> = {};
  for (const node of nodes) {
    // If there are no indexed events you cannot query it
    if (!node.inputs.some((input) => input.indexed)) continue;
    if (!record[node.name]) record[node.name] = [];
    record[node.name].push(node);
  }
  const queries = Object.entries(record)
    .map(([name, queryNodes]) => {
      const types = queryNodes.map(node => getQuery(node, config));
      const doc = toJsDoc(config.natspec?.events?.[signatureName(queryNodes[0])]?.details);
      return withDoc(`${name}: ${getOverloadType(types)}`, doc);
    })
    .join('\n');
  if (queries) return `{ ${queries} }`;
  return 'never';
};

const getQuery = (node: EventDescription, config: Config) => {
  const params = config.natspec?.events?.[signatureName(node)]?.params || {};
  const fields = node.inputs
    .map((input) => withDoc(`${input.name}: ${getType(input, 'output')}`, toJsDoc(params[input.name])))
    .join(';\n');
  return `{\n${fields}\n}`;
};


/////////////////
// CONSTRUCTOR //
/////////////////

export const getDeploy = (contractName: string, inputs: ABIParameter[] = []) => {
  const params = inputs
    .map(getParam)
    .concat('overrides?: PayableOverrides')
    .join(', ');
  return `deploy!: (${params}) => Promise<${contractName}>;`;
};


// const getOverload = (nodes: FunctionDescription[], isWrite = false) => {
//   const maxSize = Math.max(...nodes.map(node => node.inputs.length));
//   const outputs = isWrite
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