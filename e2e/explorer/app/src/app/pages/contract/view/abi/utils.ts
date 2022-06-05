import { FormArray, FormControl } from '@angular/forms';
import { ABIDescription, ABIParameter, ABITypeParameter, FunctionDescription } from '@type/solc';
import { isWrite, isRead } from '@ngeth/tools';

type AbiForm = {
  name: string;
  control: FormControl | FormArray;
  type: 'boolean' | 'number' | 'text' | 'address' | 'object';
  isArray: boolean;
}



function formABI(abi: ABIDescription[]) {
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
  if (type.endsWith(']')) {
    const [type] = splitArray(param.type);
    return abiForm(type, getFormArray(param), true);
  }
  if (type === 'tuple') return abiForm('object', new FormControl());
  if (type === 'string') return abiForm('text', new FormControl());
  if (type === 'address') return abiForm('address', new FormControl());
  if (type === 'bool') return abiForm('boolean', new FormControl());
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



function createAbiForm(description: FunctionDescription) {
  if (!description.inputs?.length) return;
  const controls: Record<string, AbiForm> = {};
  for (const input of description.inputs) {
    controls[input.name] = getAbiControl(input);
  }
  return controls;
}
