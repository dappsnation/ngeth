import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { ContractsManager, EthersModule,  SUPPORTED_CHAINS, HasProviderGuard, IsSupportedChainGuard, ERC1193 } from '@ngeth/ethers';
import { HasSignerGuard, MetaMask } from '@ngeth/metamask';
import { FIREBASE_CONFIG } from 'ngfire';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { BaseContractsManager } from './services/manager';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{
      path: 'no-provider',
      loadChildren: () => import('./no-provider/no-provider.module').then(m => m.NoProviderModule),
    }, {
      path: 'no-signer',
      loadChildren: () => import('./no-signer/no-signer.module').then(m => m.NoSignerModule),
    }, {
      path: 'unsupported-chain',
      loadChildren: () => import('./unsupported-chain/unsupported-chain.module').then(m => m.UnsupportedChainModule),
    },{
      path: 'search',
      canActivate: [HasProviderGuard, HasSignerGuard, IsSupportedChainGuard],
      loadChildren: () => import('./search/search.module').then(m => m.SearchModule),
    }, {
      path: 'admin',
      canActivate: [HasProviderGuard, HasSignerGuard, IsSupportedChainGuard],
      loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    }]),
    ReactiveFormsModule,
    EthersModule,
  ],
  providers: [
    { provide: FIREBASE_CONFIG, useValue: environment.firebase },
    { provide: SUPPORTED_CHAINS, useValue: '*' },
    { provide: ERC1193, useClass: MetaMask },
    { provide: ContractsManager, useClass: BaseContractsManager },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
