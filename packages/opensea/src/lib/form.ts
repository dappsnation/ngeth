import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OpenseaCollectionMetadata, OpenseaTokenMetadata, OpenseaAttribute } from './types';

export class OpenseaCollectionForm extends FormGroup {
  override value!: OpenseaCollectionMetadata;
  override valueChanges!: Observable<OpenseaCollectionMetadata>;

  constructor(initial: Partial<OpenseaCollectionMetadata> = {}) {
    super({
      name: new FormControl(initial.name, [Validators.required]),
      description: new FormControl(initial.description),
      image: new FormControl(initial.image),
      external_link: new FormControl(initial.external_link),
      seller_fee_basis_points: new FormControl(initial.seller_fee_basis_points, [Validators.max(1000)]),
      fee_recipient: new FormControl(initial.name),
    })
  }
}


export class OpenseaAttributeForm extends FormGroup {
  override value!: OpenseaAttribute;
  override valueChanges!: Observable<OpenseaAttribute>;

  constructor(attribute: Partial<OpenseaAttribute> = {}) {
    super({
      trait_type: new FormControl(attribute.trait_type, [Validators.required]),
      display_type: new FormControl(attribute.display_type, [Validators.required]),
      max_value: new FormControl(attribute.max_value),
      value: new FormControl(attribute.value),
    });
  }
}


export class OpenseaTokenForm extends FormGroup {
  override value!: OpenseaTokenMetadata;
  override valueChanges!: Observable<OpenseaTokenMetadata>;

  constructor(initial: Partial<OpenseaTokenMetadata> = {}) {
    const attributeControls = (initial.attributes ?? []).map(attribute => new OpenseaAttributeForm(attribute))
    super({
      image: new FormControl(initial.image),
      external_url: new FormControl(initial.external_url),
      description: new FormControl(initial.description),
      name: new FormControl(initial.name),
      attributes: new FormArray(attributeControls),
      background_color: new FormControl(initial.background_color),
      animation_url: new FormControl(initial.animation_url),
      youtube_url: new FormControl(initial.youtube_url),
    })
  }

  get attributes() {
    return this.get('attributes') as FormArray;
  }

  addAttribute(attribute: Partial<OpenseaAttribute> = {}) {
    this.attributes.push(new OpenseaAttributeForm(attribute));
  }
  
}