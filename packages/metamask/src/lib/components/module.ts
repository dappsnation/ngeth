import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EthersModule } from '@ngeth/ethers';
import { ConnectComponent } from './connect/connect.component';
import { JazzIconComponent } from './jazzicon';

@NgModule({
  declarations: [ConnectComponent, JazzIconComponent],
  exports: [ConnectComponent, JazzIconComponent],
  imports: [CommonModule, EthersModule]
})
export class MetaMaskModule {}