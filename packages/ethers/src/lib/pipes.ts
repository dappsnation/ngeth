import { Inject, Pipe, PipeTransform } from '@angular/core';
import { BigNumber, BigNumberish, constants } from 'ethers';
import { getAddress } from '@ethersproject/address';
import { formatEther } from '@ethersproject/units';
import { Chain, explore, isSupportedChain, SupportedChains, SUPPORTED_CHAINS } from './chain';

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

@Pipe({ name: 'supportedChain' })
export class SupportedChainPipe implements PipeTransform {
  constructor(@Inject(SUPPORTED_CHAINS) private supportedChains: SupportedChains) {}
  transform(chainId: string | number) {
    return isSupportedChain(chainId, this.supportedChains);
  }
}

@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {
  transform(address: string, format: 'short' | 'full' = 'full') {
    const account = getAddress(address);
    if (format === 'short') return `${account.slice(0, 6)}...${account.slice(-4)}`;
    return account;
  }
}

export const ethersPipes = [BigNumberPipe, EthPipe, ExporePipe, AddressPipe, SupportedChainPipe];