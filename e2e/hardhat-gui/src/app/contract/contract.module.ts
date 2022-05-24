import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractComponent } from './contract.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ContractComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ContractComponent }])
  ]
})
export class ContractModule { }
