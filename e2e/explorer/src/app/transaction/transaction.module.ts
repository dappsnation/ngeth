import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TransactionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: TransactionComponent }]),
  ],
})
export class TransactionModule {}
