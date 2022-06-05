import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { rpcProvider } from '@ngeth/ethers';
import { RedirectAddress } from './address.guard';

import { AppComponent } from './app.component';
import { walletSigner } from './wallet';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'block',
        pathMatch: 'full'
      },
      {
        path: 'block',
        loadChildren: () =>
          import('./pages/block/list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'block/:blockNumber',
        loadChildren: () =>
          import('./pages/block/view/view.module').then((m) => m.ViewModule),
      },
      {
        path: 'tx',
        loadChildren: () =>
          import('./pages/transaction/list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'tx/:hash',
        loadChildren: () =>
          import('./pages/transaction/view/view.module').then((m) => m.ViewModule),
      },
      {
        path: 'address/:address',
        canActivate: [RedirectAddress],
        component: AppComponent // Component or loadChildren is required
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./pages/account/list/list.module').then((m) => m.ListModule),
      },
      {
        path: 'account/:address',
        loadChildren: () =>
          import('./pages/account/view/view.module').then((m) => m.ViewModule),
      },
      {
        path: 'contract',
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
  providers: [
    rpcProvider('http://localhost:8545'),
    walletSigner()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
