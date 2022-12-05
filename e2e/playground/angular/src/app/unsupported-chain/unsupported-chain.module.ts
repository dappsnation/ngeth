import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsupportedChainComponent } from './unsupported-chain.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    UnsupportedChainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: UnsupportedChainComponent }])
  ]
})
export class UnsupportedChainModule { }
