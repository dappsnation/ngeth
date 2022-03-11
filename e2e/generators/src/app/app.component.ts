import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { getContract } from '@ngeth/hardhat/generate';

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
    const contract = getContract(name, JSON.parse(abi));
    console.log(contract);
  }
}
