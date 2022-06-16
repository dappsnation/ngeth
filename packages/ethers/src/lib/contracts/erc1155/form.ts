import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import type { BigNumber } from '@ethersproject/bignumber';
import type { Observable } from "rxjs";
import { EthValidators } from "../../form";

interface ERC1155TransferControls {
  from?: string;
  to: string;
  tokenId: number;
  amount: number;
}

interface ERC1155MintControls {
  to: string;
  tokenId: number;
  amount: number;
  data?: string;
  uri?: string;
}



export class ERC1155FormTransfer extends UntypedFormGroup {
  override value!: ERC1155TransferControls;
  override valueChanges!: Observable<ERC1155TransferControls>;

  constructor(value: Partial<ERC1155TransferControls> = {}) {
    super({
      from: new UntypedFormControl(value.from, [EthValidators.address]),
      to: new UntypedFormControl(value.to, [Validators.required, EthValidators.address]),
      tokenId: new UntypedFormControl(value.tokenId, [Validators.required]),
      amount: new UntypedFormControl(value.amount, [Validators.required, Validators.min(0)])
    })
  }

  setTokens(tokens: Record<string, BigNumber>) {
    this.addValidators(EthValidators.ownTokenAmount(tokens));
  }
}


export class ERC1155FormMint extends UntypedFormGroup {
  override value!: ERC1155MintControls;
  override valueChanges!: Observable<ERC1155MintControls>;

  constructor(value: Partial<ERC1155MintControls> = {}) {
    super({
      to: new UntypedFormControl(value.to, [Validators.required, EthValidators.address]),
      tokenId: new UntypedFormControl(value.tokenId, [Validators.required]),
      amount: new UntypedFormControl(value.amount, [Validators.required]),
      uri: new UntypedFormControl(value.uri),
      data: new UntypedFormControl(value.data)
    })
  }
}