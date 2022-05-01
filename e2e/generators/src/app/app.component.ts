import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngeth-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form = new FormGroup({
    name: new FormControl(),
    abi: new FormControl(),
  });
  generate() {
    const { name, abi } = this.form.value;
  }
}
