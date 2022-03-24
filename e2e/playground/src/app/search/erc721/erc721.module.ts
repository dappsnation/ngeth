import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Erc721Component } from './erc721.component';



@NgModule({
  declarations: [
    Erc721Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: Erc721Component }])
  ]
})
export class Erc721PageModule { }
