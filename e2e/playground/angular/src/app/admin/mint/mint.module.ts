import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MintComponent } from './mint.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IpfsModule } from '@ngeth/ipfs';



@NgModule({
  declarations: [
    MintComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IpfsModule,
    RouterModule.forChild([{path: '', component: MintComponent}])
  ]
})
export class MintModule { }
