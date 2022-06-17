import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'ngeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form = new UntypedFormGroup({
    name: new UntypedFormControl(),
    abi: new UntypedFormControl(),
  });
  generate() {
    const { name, abi } = this.form.value;
  }
}
