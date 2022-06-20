import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Erc1155Component } from './erc1155.component';
import { EthersModule } from '@ngeth/ethers-angular';



@NgModule({
  declarations: [
    Erc1155Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EthersModule,
    RouterModule.forChild([{ path: '', component: Erc1155Component }])
  ]
})
export class Erc1155PageModule { }
