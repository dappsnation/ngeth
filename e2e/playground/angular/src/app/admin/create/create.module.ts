import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IpfsModule } from '@ngeth/ipfs';
import { EthersModule } from '@ngeth/ethers-angular';



@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IpfsModule,
    EthersModule,
    RouterModule.forChild([{ path: '', component: CreateComponent }])
  ]
})
export class CreateModule { }
