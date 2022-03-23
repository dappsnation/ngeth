import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { isAddress } from "@ethersproject/address";
import { BigNumber } from "ethers";

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

export function ownTokenAmount(tokens: Record<string, BigNumber>): ValidatorFn  {
  return (control: AbstractControl): ValidationErrors|null => {
    const { tokenId, amount } = control.value;
    const quantity: BigNumber = typeof amount === 'number' ? BigNumber.from(amount) : amount; 
    if (tokens[tokenId].gt(quantity)) return null;
    return {
      ownTokenAmount: {
        owned: tokens[tokenId] ?? BigNumber.from(0),
        actual: control.value
      }
    };
  };
}

export const EthValidators = {
  address,
  ownToken,
  ownTokenAmount,
}