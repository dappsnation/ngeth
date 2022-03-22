import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigNumber, BigNumberish, constants } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { Chain, explore } from './chain';
import { JazzIconComponent } from './components';

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

@Pipe({ name: 'explore' })
export class ExporePipe implements PipeTransform {
  transform(search: string, chain: Chain) {
    return explore(chain, search);
  }
}

const pipes = [BigNumberPipe, EthPipe, ExporePipe];
const components = [JazzIconComponent];

@NgModule({
  declarations: [...pipes, ...components],
  exports: [...pipes, ...components],
  imports: [CommonModule],
})
export class EthersModule {}
