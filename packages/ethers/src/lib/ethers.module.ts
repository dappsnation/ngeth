import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigNumber, BigNumberish, constants } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

@Pipe({ name: 'bignumber' })
export class BigNumberPipe implements PipeTransform {
  transform(value: BigNumberish) {
    return value instanceof BigNumber
      ? value.toNumber()
      : value;
  }
}

@Pipe({ name: 'eth' })
export class EthPipe implements PipeTransform {
  transform(value: BigNumberish) {
    return `${formatEther(value)} ${constants.EtherSymbol}`;
  }
}

@NgModule({
  declarations: [BigNumberPipe, EthPipe],
  exports: [BigNumberPipe, EthPipe],
  imports: [CommonModule],
})
export class EthersModule {}
