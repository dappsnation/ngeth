import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OpenseaCollectionMetadata, OpenseaTokenMetadata, OpenseaAttribute } from './types';

export class OpenseaCollectionForm extends UntypedFormGroup {
  override value!: OpenseaCollectionMetadata;
  override valueChanges!: Observable<OpenseaCollectionMetadata>;

  constructor(initial: Partial<OpenseaCollectionMetadata> = {}) {
    super({
      name: new UntypedFormControl(initial.name, [Validators.required]),
      description: new UntypedFormControl(initial.description),
      image: new UntypedFormControl(initial.image),
      external_link: new UntypedFormControl(initial.external_link),
      seller_fee_basis_points: new UntypedFormControl(initial.seller_fee_basis_points, [Validators.max(1000)]),
      fee_recipient: new UntypedFormControl(initial.name),
    })
  }
}


export class OpenseaAttributeForm extends UntypedFormGroup {
  override value!: OpenseaAttribute;
  override valueChanges!: Observable<OpenseaAttribute>;

  constructor(attribute: Partial<OpenseaAttribute> = {}) {
    super({
      trait_type: new UntypedFormControl(attribute.trait_type, [Validators.required]),
      display_type: new UntypedFormControl(attribute.display_type, [Validators.required]),
      max_value: new UntypedFormControl(attribute.max_value),
      value: new UntypedFormControl(attribute.value),
    });
  }
}


export class OpenseaTokenForm extends UntypedFormGroup {
  override value!: OpenseaTokenMetadata;
  override valueChanges!: Observable<OpenseaTokenMetadata>;

  constructor(initial: Partial<OpenseaTokenMetadata> = {}) {
    const attributeControls = (initial.attributes ?? []).map(attribute => new OpenseaAttributeForm(attribute))
    super({
      image: new UntypedFormControl(initial.image),
      external_url: new UntypedFormControl(initial.external_url),
      description: new UntypedFormControl(initial.description),
      name: new UntypedFormControl(initial.name),
      attributes: new UntypedFormArray(attributeControls),
      background_color: new UntypedFormControl(initial.background_color),
      animation_url: new UntypedFormControl(initial.animation_url),
      youtube_url: new UntypedFormControl(initial.youtube_url),
    })
  }

  get attributes() {
    return this.get('attributes') as UntypedFormArray;
  }

  addAttribute(attribute: Partial<OpenseaAttribute> = {}) {
    this.attributes.push(new OpenseaAttributeForm(attribute));
  }
  
}