import { FormControl, FormGroup, Validators } from "@angular/forms";
import type { BigNumber } from '@ethersproject/bignumber';
import { EthValidators } from "../../form";
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



export class ERC1155FormTransfer extends FormGroup<ToFormControls<ERC1155Transfer>> {
  constructor(value: Partial<ERC1155Transfer> = {}) {
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


export class ERC1155FormMint extends FormGroup<ToFormControls<ERC1155Mint>> {
  constructor(value: Partial<ERC1155Mint> = {}) {
    super({
      to: new FormControl(value.to, [Validators.required, EthValidators.address]),
      tokenId: new FormControl(value.tokenId, [Validators.required]),
      amount: new FormControl(value.amount, [Validators.required]),
      uri: new FormControl(value.uri),
      data: new FormControl(value.data)
    })
  }
}