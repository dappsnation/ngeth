import { ValidatorFn } from "@angular/forms";
import { BigNumber } from "@ethersproject/bignumber";
export declare const address: ValidatorFn;
export declare function ownToken(tokenIds: string[]): ValidatorFn;
export declare function ownTokenAmount(tokens: Record<string, BigNumber>): ValidatorFn;
export declare const EthValidators: {
    address: ValidatorFn;
    ownToken: typeof ownToken;
    ownTokenAmount: typeof ownTokenAmount;
};
