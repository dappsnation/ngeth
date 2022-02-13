import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { EthModule } from 'ngeth';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{
      path: 'admin',
      loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    }]),
    ReactiveFormsModule,
    EthModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
