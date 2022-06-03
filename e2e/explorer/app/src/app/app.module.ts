import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { rpcProvider } from '@ngeth/ethers';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'blocks',
        pathMatch: 'full'
      },
      {
        path: 'blocks',
        loadChildren: () =>
          import('./pages/block/list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'block/:blockNumber',
        loadChildren: () =>
          import('./pages/block/view/view.module').then((m) => m.ViewModule),
      },
      {
        path: 'txs',
        loadChildren: () =>
          import('./pages/transaction/list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'tx/:hash',
        loadChildren: () =>
          import('./pages/transaction/view/view.module').then((m) => m.ViewModule),
      },
      {
        path: 'addresses',
        loadChildren: () =>
          import('./pages/address/list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'address/:address',
        loadChildren: () =>
          import('./pages/address/view/view.module').then((m) => m.ViewModule),
      },
      {
        path: 'contract/:address',
        loadChildren: () =>
          import('./pages/contract/contract.module').then((m) => m.ContractModule),
      },
    ]),
  ],
  providers: [rpcProvider('http://localhost:8545')],
  bootstrap: [AppComponent],
})
export class AppModule {}
