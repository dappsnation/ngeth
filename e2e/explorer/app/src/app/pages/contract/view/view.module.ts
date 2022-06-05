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
    RouterModule.forChild([{
      path: '',
      component: ViewComponent,
      children: [{
        path: '',
        redirectTo: 'transactions',
        pathMatch: 'full'
      }, {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule)
      }, {
        path: 'abi',
        loadChildren: () => import('./abi/abi.module').then(m => m.AbiModule)
      }]
    }]),
  ],
})
export class ViewModule {}
