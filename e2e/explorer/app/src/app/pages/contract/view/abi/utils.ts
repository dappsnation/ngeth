import { FormArray, FormControl } from '@angular/forms';
import { ABIDescription, ABIParameter, ABITypeParameter, FunctionDescription } from '@type/solc';
import { isWrite, isRead } from '@ngeth/tools';

export interface AbiFormFunction {
  name?: string;
  inputs: AbiForm[];
  outputs?: any[];
  form: FormArray;
  result?: any;
}

type AbiForm = {
  name: string;
  control: FormControl;
  type: 'checkbox' | 'number' | 'text' | 'address' | 'object';
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
  const type = param.type;
  const abiForm = (type: AbiForm['type'], control: AbiForm['control'], isArray: boolean = false) => ({
    name: param.name,
    control,
    type,
    isArray
  })
  // TODO: Find out how to manage that
  if (type.endsWith(']')) {
    return abiForm('text', new FormControl());
    // const [type] = splitArray(param.type);
    // return abiForm(type, getFormArray(param), true);
  }
  if (type === 'tuple') return abiForm('object', new FormControl());
  if (type === 'string') return abiForm('text', new FormControl());
  if (type === 'address') return abiForm('address', new FormControl());
  if (type === 'bool') return abiForm('checkbox', new FormControl());
  if (type.startsWith('bytes')) return abiForm('text', new FormControl());
  if (type.includes('int')) return abiForm('number', new FormControl());
  return abiForm('text', new FormControl());
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
    return new FormArray(controls);
  } else {
    return new FormArray([]);
  }
};



function createAbiForm(description: FunctionDescription): AbiFormFunction {
  if (!description.inputs?.length) return { name: description.name, inputs: [], form: new FormArray([]) };
  const inputs = description.inputs.map(getAbiControl);
  const controls = inputs.map(input => input.control);
  return  { name: description.name, inputs, form: new FormArray(controls) };
}
