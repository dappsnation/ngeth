import { FormGroup, Validators, FormControl } from "@angular/forms";
import { EthValidators } from "../../form";
import { ToFormControls } from "../utils";

interface ERC20Transfer {
  to: string;
  amount: number;
}

export class ERC20FormTransfer extends FormGroup<ToFormControls<ERC20Transfer>> {
  constructor(value: Partial<ERC20Transfer> = {}) {
    super({
      to: new FormControl(value.to, [Validators.required, EthValidators.address]),
      amount: new FormControl(value.amount, [Validators.min(0)]),
    })
  }

  setBalance(amount: number) {
    this.get('amount')?.addValidators(Validators.max(amount));
  }
}
