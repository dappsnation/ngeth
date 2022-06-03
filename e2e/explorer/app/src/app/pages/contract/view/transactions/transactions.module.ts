import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: TransactionsComponent }])
  ]
})
export class TransactionsModule { }
