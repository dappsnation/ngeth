import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { isAddress } from "@ethersproject/address";

export function address(): ValidatorFn  {
  return (control: AbstractControl): ValidationErrors|null => {
    if (isAddress(control.value)) return null;
    return { address: true };
  };
}

export function ownToken(tokenIds: string[]): ValidatorFn  {
  return (control: AbstractControl): ValidationErrors|null => {
    if (tokenIds.includes(control.value)) return null;
    return { ownToken: { owned: tokenIds, actual: control.value } };
  };
}

export const EthValidators = {
  address,
  ownToken,
}