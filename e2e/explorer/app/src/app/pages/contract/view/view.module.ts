import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import { RouterModule } from '@angular/router';
import { EthersModule } from '@ngeth/ethers-angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewComponent],
  imports: [
    CommonModule,
    EthersModule,
    ReactiveFormsModule,
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
      }, {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
      }]
    }]),
  ],
})
export class ViewModule {}
