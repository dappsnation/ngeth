import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { EthModule } from '@ngeth/ethers';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    ReactiveFormsModule,
    EthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
