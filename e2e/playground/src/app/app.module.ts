import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { EthersModule, HasProviderGuard, HasSignerGuard } from '@ngeth/ethers';
import { AppComponent } from './app.component';

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
    },{
      path: 'search',
      canActivate: [HasProviderGuard, HasSignerGuard],
      loadChildren: () => import('./search/search.module').then(m => m.SearchModule),
    }, {
      path: 'admin',
      canActivate: [HasProviderGuard, HasSignerGuard],
      loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    }]),
    ReactiveFormsModule,
    EthersModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
