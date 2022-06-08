import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ViewComponent } from '../view.component';
import { AbiFormFunction, formABI } from './utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'explorer-contract-abi',
  templateUrl: './abi.component.html',
  styleUrls: ['./abi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbiComponent {
  forms$ = this.shell.contract$.pipe(
    map(contract => formABI(contract.artifact.abi))
  );

  constructor(
    private shell: ViewComponent,
    private cdr: ChangeDetectorRef
  ) { }

  async callRead(read: AbiFormFunction) {
    if (!read.name) return;
    if (read.form.invalid) return read.form.markAllAsTouched();
    const inputs = read.form.value;
    read.result = await this.shell.contract?.callStatic[read.name](...inputs);
    read.form.reset();
    this.cdr.markForCheck();
  }

  async callWrite(write: AbiFormFunction) {
    if (!write.name) return;
    if (write.form.invalid) return write.form.markAllAsTouched();
    const inputs = write.form.value;
    await this.shell.contract?.functions[write.name](...inputs);
    write.form.reset();
    this.cdr.markForCheck();
  }
}
