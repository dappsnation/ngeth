import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RouterModule } from '@angular/router';
import { EthersModule } from '@ngeth/ethers-angular';



@NgModule({
  declarations: [
    EventsComponent
  ],
  imports: [
    CommonModule,
    EthersModule,
    RouterModule.forChild([{ path: '', component: EventsComponent }])
  ]
})
export class EventsModule { }
