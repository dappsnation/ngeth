import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { RouterModule } from '@angular/router';
import { EthersModule } from '@ngeth/ethers';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    EthersModule,
    RouterModule.forChild([{ path: '', component: ListComponent }])
  ]
})
export class ListModule { }