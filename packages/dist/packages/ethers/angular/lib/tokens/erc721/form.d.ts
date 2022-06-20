import { FormGroup } from "@angular/forms";
import { ToFormControls } from "../utils";
interface ERC721Transfer {
    from?: string;
    to: string;
    tokenId: number;
}
interface ERC721Mint {
    to: string;
    tokenId: number;
    uri: string;
}
export declare class ERC721FormTransfer extends FormGroup<ToFormControls<ERC721Transfer>> {
    constructor(value?: Partial<ERC721Transfer>);
    setTokens(tokenIds: string[]): void;
}
export declare class ERC721FormMint extends FormGroup<ToFormControls<ERC721Mint>> {
    constructor(value?: Partial<ERC721Mint>);
}
export {};
