import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import { RouterModule } from '@angular/router';
import { EthersModule } from '@ngeth/ethers';

@NgModule({
  declarations: [ViewComponent],
  imports: [
    CommonModule,
    EthersModule,
    RouterModule.forChild([{ path: '', component: ViewComponent }]),
  ],
})
export class ViewModule {}
