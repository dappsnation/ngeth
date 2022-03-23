import { FormControl, FormGroup, Validators } from "@angular/forms";
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



export class ERC721FormTransfer extends FormGroup {
  override value!: ERC721TransferControls;
  override valueChanges!: Observable<ERC721TransferControls>;

  constructor(value: Partial<ERC721TransferControls> = {}) {
    super({
      from: new FormControl(value.from, [EthValidators.address]),
      to: new FormControl(value.to, [Validators.required, EthValidators.address]),
      tokenId: new FormControl(value.tokenId, [Validators.required]),
    })
  }

  setTokens(tokenIds: string[]) {
    this.get('tokenId')?.addValidators(EthValidators.ownToken(tokenIds));
  }
}


export class ERC721FormMint extends FormGroup {
  override value!: ERC721MintControls;
  override valueChanges!: Observable<ERC721MintControls>;

  constructor(value: Partial<ERC721MintControls> = {}) {
    super({
      to: new FormControl(value.to, [Validators.required, EthValidators.address]),
      tokenId: new FormControl(value.tokenId, [Validators.required]),
      uri: new FormControl(value.uri, [Validators.required]),
    })
  }
}