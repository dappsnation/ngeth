import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockComponent } from './block.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    BlockComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: BlockComponent }])
  ]
})
export class BlockModule { }
