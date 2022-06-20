import { UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { ABIDescription, ABIParameter, ABITypeParameter, FunctionDescription } from '@type/solc';
import { isWrite, isRead } from '@ngeth/tools';

export interface AbiFormFunction {
  name?: string;
  inputs: AbiForm[];
  outputs?: any[];
  form: UntypedFormArray;
  result?: any;
}

type AbiForm = {
  name: string;
  control: UntypedFormControl;
  type: 'boolean' | 'number' | 'text' | 'address' | 'object';
  paramType: ABITypeParameter;
  isArray: boolean;
}



export function formABI(abi: ABIDescription[]) {
  return {
    writes: abi.filter(isWrite).map(description => createAbiForm(description)),
    reads: abi.filter(isRead).map(description => createAbiForm(description)),
  }
}

//////////////////
// FORM CONTROL //
//////////////////
const getAbiControl = (param: ABIParameter): AbiForm => {
  const abiForm = (type: AbiForm['type'], control: AbiForm['control'], isArray: boolean = false) => ({
    name: param.name,
    paramType: param.type,
    control,
    type,
    isArray
  })
  // TODO: Find out how to manage that
  const type = param.type;
  if (type.endsWith(']')) {
    return abiForm('object', new UntypedFormControl());
    // const [type] = splitArray(param.type);
    // return abiForm(type, getFormArray(param), true);
  }
  if (type === 'tuple') return abiForm('object', new UntypedFormControl());
  if (type === 'string') return abiForm('text', new UntypedFormControl());
  if (type === 'address') return abiForm('address', new UntypedFormControl());
  if (type === 'bool') return abiForm('boolean', new UntypedFormControl());
  if (type.startsWith('bytes')) return abiForm('text', new UntypedFormControl());
  if (type.includes('int')) return abiForm('number', new UntypedFormControl());
  return abiForm('text', new UntypedFormControl());
};

////////////////
// FORM ARRAY //
////////////////

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


const getFormArray = (param: ABIParameter) => {
  const [type, end] = splitArray(param.type);
  const amount = getArrayAmount(end);
  const control = getAbiControl({ ...param, type });
  if (!isNaN(amount)) {
    const controls = new Array(amount).fill(control);
    return new UntypedFormArray(controls);
  } else {
    return new UntypedFormArray([]);
  }
};



function createAbiForm(description: FunctionDescription): AbiFormFunction {
  if (!description.inputs?.length) return { name: description.name, inputs: [], form: new UntypedFormArray([]) };
  const inputs = description.inputs.map(getAbiControl);
  const controls = inputs.map(input => input.control);
  return  { name: description.name, inputs, form: new UntypedFormArray(controls) };
}
