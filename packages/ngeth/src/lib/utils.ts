import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { BigNumber } from 'ethers';

export const address0 = "0x".padEnd(42, '0');

@Pipe({ name: 'bignumber' })
export class BigNumberPipe implements PipeTransform {
  transform(value: BigNumber) {
    return value.toNumber();
  }
}


@NgModule({
  exports: [BigNumberPipe],
  declarations: [BigNumberPipe],
})
export class EthModule {}