import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoWalletComponent } from './no-wallet.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NoWalletComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: NoWalletComponent }])
  ]
})
export class NoWalletModule { }
