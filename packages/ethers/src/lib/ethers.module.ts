import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigNumber } from 'ethers';

@Pipe({ name: 'bignumber' })
export class BigNumberPipe implements PipeTransform {
  transform(value: BigNumber) {
    return value.toNumber();
  }
}

@NgModule({
  declarations: [BigNumberPipe],
  exports: [BigNumberPipe],
  imports: [CommonModule],
})
export class EthersModule {}
