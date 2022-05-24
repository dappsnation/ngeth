import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { rpcProvider } from '@ngeth/ethers';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    RouterModule.forRoot([{
      path: '',
      loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    },{
      path: 'block/:blockNumber',
      loadChildren: () => import('./block/block.module').then(m => m.BlockModule),
    },{
      path: 'address/:address',
      loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
    },{
      path: 'contract/:address',
      loadChildren: () => import('./contract/contract.module').then(m => m.ContractModule),
    },{
      path: 'tx/:hash',
      loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule),
    }])
  ],
  providers: [rpcProvider('http://localhost:8545')],
  bootstrap: [AppComponent],
})
export class AppModule {}
