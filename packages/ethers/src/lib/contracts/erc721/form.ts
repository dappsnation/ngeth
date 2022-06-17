import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import type { Observable } from "rxjs";
import { EthValidators } from "../../form";

interface ERC721TransferControls {
  from?: string;
  to: string;
  tokenId: number;
}

interface ERC721MintControls {
  to: string;
  tokenId: number;
  uri: string;
}



export class ERC721FormTransfer extends UntypedFormGroup {
  override value!: ERC721TransferControls;
  override valueChanges!: Observable<ERC721TransferControls>;

  constructor(value: Partial<ERC721TransferControls> = {}) {
    super({
      from: new UntypedFormControl(value.from, [EthValidators.address]),
      to: new UntypedFormControl(value.to, [Validators.required, EthValidators.address]),
      tokenId: new UntypedFormControl(value.tokenId, [Validators.required]),
    })
  }

  setTokens(tokenIds: string[]) {
    this.get('tokenId')?.addValidators(EthValidators.ownToken(tokenIds));
  }
}


export class ERC721FormMint extends UntypedFormGroup {
  override value!: ERC721MintControls;
  override valueChanges!: Observable<ERC721MintControls>;

  constructor(value: Partial<ERC721MintControls> = {}) {
    super({
      to: new UntypedFormControl(value.to, [Validators.required, EthValidators.address]),
      tokenId: new UntypedFormControl(value.tokenId, [Validators.required]),
      uri: new UntypedFormControl(value.uri, [Validators.required]),
    })
  }
}