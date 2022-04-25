import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPFS, IPFSClient } from '@ngeth/ipfs';
import { OpenseaCollectionForm } from '@ngeth/opensea';
import { Factory } from '../../services/factory';

@Component({
  selector: 'ngeth-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent {
  form = new OpenseaCollectionForm();

  constructor(
    private factory: Factory,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(IPFS) private ipfs: IPFSClient
  ) {}

  reset(event: Event) {
    event.preventDefault();
    this.form.reset();
  }

  async create() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const { name, image } = this.form.value;
    this.form.disable();
    try {
      const content = JSON.stringify({ name, image });
      const res = await this.ipfs.add({ content });
      await this.factory.create(`ipfs://${res.path}`, '');
      this.router.navigate(['..'], { relativeTo: this.route });
    } catch(err) {
      console.error(err);
      this.form.enable();
    }
  }
}
