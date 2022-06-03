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
        path: 'accounts',
        loadChildren: () =>
          import('./pages/account/list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'account/:address',
        loadChildren: () =>
          import('./pages/account/view/view.module').then((m) => m.ViewModule),
      },
      {
        path: 'contracts',
        loadChildren: () =>
          import('./pages/contract/list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'contract/:address',
        loadChildren: () =>
          import('./pages/contract/view/view.module').then((m) => m.ViewModule),
      }
    ]),
  ],
  providers: [rpcProvider('http://localhost:8545')],
  bootstrap: [AppComponent],
})
export class AppModule {}
