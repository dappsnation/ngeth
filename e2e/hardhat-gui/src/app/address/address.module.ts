import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { RouterModule } from '@angular/router';
import { EthersModule } from '@ngeth/ethers';



@NgModule({
  declarations: [
    AddressComponent
  ],
  imports: [
    CommonModule,
    EthersModule,
    RouterModule.forChild([{ path: '', component: AddressComponent }])
  ]
})
export class AddressModule { }
