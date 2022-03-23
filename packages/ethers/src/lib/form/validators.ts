import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { isAddress } from "@ethersproject/address";

export function address(): ValidatorFn  {
  return (control: AbstractControl): ValidationErrors|null => {
    if (isAddress(control.value)) return null;
    return { address: true };
  };
}

export const EthValidators = {
  address,
}