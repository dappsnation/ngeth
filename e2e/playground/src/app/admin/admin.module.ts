import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: AdminComponent,
      children: [{
        path: '',
        loadChildren: () => import('./list/list.module').then(m => m.ListModule)
      },{
        path: 'create',
        loadChildren: () => import('./create/create.module').then(m => m.CreateModule),
      },{
        path: ':address',
        loadChildren: () => import('./erc1155/erc1155.module').then(m => m.Erc1155Module)
      },{
        path: ':address/mint',
        loadChildren: () => import('./mint/mint.module').then(m => m.MintModule)
      }]
    }])
  ]
})
export class AdminModule { }
