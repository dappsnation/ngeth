import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: SearchComponent,
      children: [{
        path: 'erc1155/:address',
        loadChildren: () => import('./erc1155/erc1155.module').then(m => m.Erc1155PageModule)
      }]
    }])
  ]
})
export class SearchModule { }
