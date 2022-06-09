import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ViewComponent } from '../view.component';
import { FormArray } from '@angular/forms';
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

  private onError(form: FormArray, error: Error) {
    const err = error.message.length < 300 ? error.message : 'An error occured. Check your console';
    form.addValidators(() => ({ err }));
    form.updateValueAndValidity();
    console.error(err);
  }

  async callRead(read: AbiFormFunction) {
    if (!read.name) return;
    const inputs = read.form.value;
    try {
      read.result = await this.shell.contract?.callStatic[read.name](...inputs);
      read.form.clearValidators();
      read.form.reset();
    } catch(error) {
      this.onError(read.form, error as Error);
    }
    this.cdr.markForCheck();
  }

  async callWrite(write: AbiFormFunction) {
    if (!write.name) return;
    const inputs = write.form.value;
    try {
      const tx = await this.shell.contract?.functions[write.name](...inputs);
      await tx.wait();
      write.form.clearValidators();
      write.form.reset();
    } catch(error) {
      this.onError(write.form, error as Error);
    }
    this.cdr.markForCheck();
  }
}
