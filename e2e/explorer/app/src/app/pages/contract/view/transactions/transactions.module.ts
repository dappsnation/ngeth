import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RouterModule } from '@angular/router';
import { EthersModule } from '@ngeth/ethers-angular';



@NgModule({
  declarations: [
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    EthersModule,
    RouterModule.forChild([{ path: '', component: TransactionsComponent }])
  ]
})
export class TransactionsModule { }
