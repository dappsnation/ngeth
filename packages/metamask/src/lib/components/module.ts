import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EthersModule } from '@ngeth/ethers-angular';
import { ConnectComponent } from './connect/connect.component';
import { JazzIconComponent } from './jazzicon';

export * from './connect/connect.component';
export * from './jazzicon';

@NgModule({
  declarations: [ConnectComponent, JazzIconComponent],
  exports: [ConnectComponent, JazzIconComponent],
  imports: [CommonModule, EthersModule]
})
export class MetaMaskModule {}