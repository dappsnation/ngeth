import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenseaCollection } from '@ngeth/opensea';

@Component({
  selector: 'nxeth-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent {
  form = new FormGroup({
    type: new FormControl('opensea', [Validators.required]),
    contractURI: new FormControl(),
    uri: new FormControl(null, [Validators.required])
  });

  type = 'opensea';

  constructor(
    private openseaCollection: OpenseaCollection,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  reset() {
    this.form.reset();
  }

  async create() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { contractURI, uri } = this.form.value;
    this.form.disable();
    await this.openseaCollection.create(contractURI, uri);
    // Todo: add snackbar message
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
