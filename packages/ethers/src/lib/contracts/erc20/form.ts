import { FormControl, FormGroup, Validators } from "@angular/forms";
import type { Observable } from "rxjs";
import { EthValidators } from "../../form";

interface TransferControls {
  to: string;
  amount: number;
}

export class ERC20FormTransfer extends FormGroup {
  override value!: TransferControls;
  override valueChanges!: Observable<TransferControls>;

  constructor(value: Partial<TransferControls> = {}) {
    super({
      to: new FormControl(value.to, [Validators.required, EthValidators.address]),
      amount: new FormControl(value.amount, [Validators.min(0)]),
    })
  }

  setBalance(amount: number) {
    this.get('amount')?.addValidators(Validators.max(amount));
  }
}