import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { ContractsManager, SUPPORTED_CHAINS, IsSupportedChainGuard, HasSignerGuard, EthersModule, HasWalletGuard, ngEthersProviders } from '@ngeth/ethers-angular';
import { InjectedProviders } from '@ngeth/ethers-core';
import { MetaMaskModule, METAMASK_RELOAD } from '@ngeth/metamask';

import { AppComponent } from './app.component';
import { BaseContractsManager } from './services/manager';

const metamaskReload = () => {
  const shouldReload = window.confirm('Network issue with Metamask. We need to reload.');
  if (shouldReload) location.reload();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{
      path: 'no-metamask',
      loadChildren: () => import('./no-wallet/no-wallet.module').then(m => m.NoWalletModule),
    }, {
      path: 'no-signer',
      loadChildren: () => import('./no-signer/no-signer.module').then(m => m.NoSignerModule),
    }, {
      path: 'unsupported-chain',
      loadChildren: () => import('./unsupported-chain/unsupported-chain.module').then(m => m.UnsupportedChainModule),
    },{
      path: 'search',
      canActivate: [HasWalletGuard, HasSignerGuard, IsSupportedChainGuard],
      loadChildren: () => import('./search/search.module').then(m => m.SearchModule),
    }, {
      path: 'admin',
      canActivate: [HasWalletGuard, HasSignerGuard, IsSupportedChainGuard],
      loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    }]),
    ReactiveFormsModule,
    MetaMaskModule,
    EthersModule
  ],
  providers: [
    ...ngEthersProviders(InjectedProviders),
    { provide: SUPPORTED_CHAINS, useValue: '*' },
    { provide: METAMASK_RELOAD, useValue: metamaskReload },
    { provide: ContractsManager, useClass: BaseContractsManager },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
