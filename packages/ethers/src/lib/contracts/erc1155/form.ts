import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BigNumber } from "ethers";
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
  uri: string;
}



export class ERC1155FormTransfer extends FormGroup {
  override value!: ERC1155TransferControls;
  override valueChanges!: Observable<ERC1155TransferControls>;

  constructor(value: Partial<ERC1155TransferControls> = {}) {
    super({
      from: new FormControl(value.from, [EthValidators.address]),
      to: new FormControl(value.to, [Validators.required, EthValidators.address]),
      tokenId: new FormControl(value.tokenId, [Validators.required]),
      amount: new FormControl(value.amount, [Validators.required, Validators.min(0)])
    })
  }

  setTokens(tokens: Record<string, BigNumber>) {
    this.addValidators(EthValidators.ownTokenAmount(tokens));
  }
}


export class ERC1155FormMint extends FormGroup {
  override value!: ERC1155MintControls;
  override valueChanges!: Observable<ERC1155MintControls>;

  constructor(value: Partial<ERC1155MintControls> = {}) {
    super({
      to: new FormControl(value.to, [Validators.required, EthValidators.address]),
      tokenId: new FormControl(value.tokenId, [Validators.required]),
      uri: new FormControl(value.uri, [Validators.required]),
    })
  }
}