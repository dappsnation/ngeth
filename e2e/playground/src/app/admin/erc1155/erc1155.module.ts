import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Erc1155Component } from './erc1155.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    Erc1155Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: Erc1155Component }])
  ]
})
export class Erc1155Module { }
