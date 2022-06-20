import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EthValidators } from "../../form";
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



export class ERC721FormTransfer extends FormGroup<ToFormControls<ERC721Transfer>> {
  constructor(value: Partial<ERC721Transfer> = {}) {
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


export class ERC721FormMint extends FormGroup<ToFormControls<ERC721Mint>> {
  constructor(value: Partial<ERC721Mint> = {}) {
    super({
      to: new FormControl(value.to, [Validators.required, EthValidators.address]),
      tokenId: new FormControl(value.tokenId, [Validators.required]),
      uri: new FormControl(value.uri, [Validators.required]),
    })
  }
}