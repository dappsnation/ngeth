import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ViewComponent } from '../view.component';
import { UntypedFormArray } from '@angular/forms';
import { AbiFormFunction, formABI } from './utils';
import { filter, map } from 'rxjs/operators';
import { WalletManager } from '../../../../wallet';
import { exist } from '../../../../utils';

@Component({
  selector: 'explorer-contract-abi',
  templateUrl: './abi.component.html',
  styleUrls: ['./abi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbiComponent {
  account$ = this.walletManager.account$;
  forms$ = this.shell.contract$.pipe(
    filter(exist),
    map(contract => formABI(contract.artifact.abi))
  );

  trackByName = (i: number, form: AbiFormFunction) => form.name;

  constructor(
    private shell: ViewComponent,
    private walletManager: WalletManager,
    private cdr: ChangeDetectorRef,
  ) { }

  private onError(form: UntypedFormArray, error: Error) {
    const err = error.message.length < 300 ? error.message : 'An error occured. Check your console';
    form.addValidators(() => ({ err }));
    form.updateValueAndValidity();
    console.error(err);
  }

  private getValue(field: AbiFormFunction) {
    const value = [];
    for (let i = 0; i < field.form.length; i++) {
      const result = field.inputs[i].type === 'object'
        ? JSON.parse(field.form.at(i).value)
        : field.form.at(i).value;
      value.push(result);
    }
    return value;
  }

  async callRead(read: AbiFormFunction) {
    if (!read.name) return;
    const inputs = this.getValue(read);
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
    const inputs = this.getValue(write);
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
