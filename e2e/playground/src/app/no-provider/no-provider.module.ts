import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoProviderComponent } from './no-provider.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NoProviderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: NoProviderComponent }])
  ]
})
export class NoProviderModule { }
