import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { EthersModule } from '@ngeth/ethers';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{
      path: 'erc20/:address',
      loadChildren: () => import('./erc20/erc20.module').then(m => m.Erc20PageModule)
    },{
      path: 'erc721/:address',
      loadChildren: () => import('./erc721/erc721.module').then(m => m.Erc721PageModule)
    },{
      path: 'erc1155/:address',
      loadChildren: () => import('./erc1155/erc1155.module').then(m => m.Erc1155PageModule)
    }]),
    ReactiveFormsModule,
    EthersModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
