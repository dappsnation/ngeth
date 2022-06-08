import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ViewComponent } from '../view.component';
import { AbiFormFunction, formABI } from './utils';
import { map } from 'rxjs/operators';
import { WalletManager } from '../../../../wallet';

@Component({
  selector: 'explorer-contract-abi',
  templateUrl: './abi.component.html',
  styleUrls: ['./abi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbiComponent {
  account$ = this.walletManager.account$;
  forms$ = this.shell.contract$.pipe(
    map(contract => formABI(contract.artifact.abi))
  );

  trackByName = (i: number, form: AbiFormFunction) => form.name;

  constructor(
    private shell: ViewComponent,
    private walletManager: WalletManager,
    private cdr: ChangeDetectorRef,
  ) { }

  async callRead(read: AbiFormFunction) {
    if (!read.name) return;
    if (read.form.invalid) return read.form.markAllAsTouched();
    const inputs = read.form.value;
    try {
      read.result = await this.shell.contract?.callStatic[read.name](...inputs);
      read.form.reset();
    } catch(err) {
      read.form.addValidators(() => ({ err }));
      read.form.updateValueAndValidity();
    }
    this.cdr.markForCheck();
  }

  async callWrite(write: AbiFormFunction) {
    if (!write.name) return;
    if (write.form.invalid) return write.form.markAllAsTouched();
    const inputs = write.form.value;
    try {
      const tx = await this.shell.contract?.functions[write.name](...inputs);
      await tx.wait();
      write.form.reset();
    } catch(err) {
      write.form.addValidators(() => ({ err }));
      write.form.updateValueAndValidity();
    }
    this.cdr.markForCheck();
  }
}
