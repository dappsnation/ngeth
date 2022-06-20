import { FormGroup } from "@angular/forms";
import type { BigNumber } from '@ethersproject/bignumber';
import { ToFormControls } from "../utils";
interface ERC1155Transfer {
    from?: string;
    to: string;
    tokenId: number;
    amount: number;
}
interface ERC1155Mint {
    to: string;
    tokenId: number;
    amount: number;
    data?: string;
    uri?: string;
}
export declare class ERC1155FormTransfer extends FormGroup<ToFormControls<ERC1155Transfer>> {
    constructor(value?: Partial<ERC1155Transfer>);
    setTokens(tokens: Record<string, BigNumber>): void;
}
export declare class ERC1155FormMint extends FormGroup<ToFormControls<ERC1155Mint>> {
    constructor(value?: Partial<ERC1155Mint>);
}
export {};
