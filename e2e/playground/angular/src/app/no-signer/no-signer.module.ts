import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoSignerComponent } from './no-signer.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NoSignerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: NoSignerComponent }])
  ]
})
export class NoSignerModule { }
