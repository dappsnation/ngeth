import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ethersComponents } from './components';
import { ethersPipes } from './pipes';


@NgModule({
  declarations: [...ethersPipes, ...ethersComponents],
  exports: [...ethersPipes, ...ethersComponents],
  imports: [CommonModule],
})
export class EthersModule {}
