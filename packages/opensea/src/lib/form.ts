import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OpenseaCollectionMetadata } from './types';

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