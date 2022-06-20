import { FormGroup } from "@angular/forms";
import { ToFormControls } from "../utils";
interface ERC20Transfer {
    to: string;
    amount: number;
}
export declare class ERC20FormTransfer extends FormGroup<ToFormControls<ERC20Transfer>> {
    constructor(value?: Partial<ERC20Transfer>);
    setBalance(amount: number): void;
}
export {};
