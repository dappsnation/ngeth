import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbiComponent } from './abi.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AbiComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: AbiComponent }])
  ]
})
export class AbiModule { }
