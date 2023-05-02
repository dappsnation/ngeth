import { ABIDescription, ABIEventParameter, ABIParameter, FunctionDescription } from "@type/solc";
import { getType, isEvent, isRead, isWrite } from "./utils";

export function getDepsType(params: ABIParameter | ABIEventParameter, kind: 'input' | 'output') {
  const type = getType(params, kind);
  if (['BigNumber', 'BigNumberish', 'BytesLike'].includes(type)) return type;
  return;
}

export function getFactoryDeps(node?: FunctionDescription) {
  const deps = new Set(['Signer', 'PayableOverrides']);
  function addType(params: ABIParameter | ABIEventParameter, kind: 'input' | 'output') {
    const dep = getDepsType(params, kind);
    if (dep) deps.add(dep);
  }
  if (node) {
    node.inputs?.forEach(input => addType(input, 'input'));
  }
  return Array.from(deps).join(', ');
}

export function getContractDeps(abi: ABIDescription[], initial: string[] = []) {
  const deps = new Set(initial);
  function addType(params: ABIParameter | ABIEventParameter, kind: 'input' | 'output') {
    const dep = getDepsType(params, kind);
    if (dep) deps.add(dep);
  }
  for (const node of abi) {
    if (isRead(node)) {
      deps.add('CallOverrides');
      node.inputs?.forEach(input => addType(input, 'input'));
      node.outputs?.forEach(input => addType(input, 'output'));
    }
    if (isWrite(node)) {
      deps.add('ContractTransaction');
      node.stateMutability === 'payable'
        ? deps.add('PayableOverrides')
        : deps.add('Overrides');
      node.inputs?.forEach(input => addType(input, 'input'));
      node.outputs?.forEach(input => addType(input, 'output'));
    }
    if (isEvent(node)) {
      node.inputs?.forEach(input => addType(input, 'output')); // Event behave as output
    }

  }
  return Array.from(deps).join(', ');
}