import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Erc20Component } from './erc20.component';
import { ERC20Module } from '@ngeth/ethers';



@NgModule({
  declarations: [
    Erc20Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ERC20Module,
    RouterModule.forChild([{ path: '', component: Erc20Component }])
  ]
})
export class Erc20PageModule { }
