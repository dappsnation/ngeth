import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';
import { BigNumber, BigNumberish } from 'ethers';
import { getAddress } from '@ethersproject/address';
import { formatUnits, formatEther } from '@ethersproject/units';
import { EtherSymbol } from '@ethersproject/constants';
import { isBytes } from '@ethersproject/bytes';
import { Chain, ChainCurrency, ChainId, ChainManager, explore, isSupportedChain, SupportedChains, SUPPORTED_CHAINS } from './chain';
import { map } from 'rxjs/operators';

function formatNativeCurrency(value: BigNumberish, currency: ChainCurrency) {
  const amount = formatUnits(value, currency.decimals);
  const symbol = currency.symbol ?? currency.name;
  return `${amount} ${symbol}`;
}

@Pipe({ name: 'bignumber' })
export class BigNumberPipe implements PipeTransform {
  transform(value: BigNumberish) {
    if (value instanceof BigNumber) return value.toString();
    if (typeof value === 'bigint') return value.toString(10);
    if (typeof value === 'string') return value.startsWith('0x') ? parseInt(value) : value;
    if (isBytes(value)) return new Uint8Array(value).toString(); // todo
    return value;
  }
}

@Pipe({ name: 'ether' })
export class EtherPipe implements PipeTransform {
  transform(value?: BigNumberish | null) {
    if (value === null || value === undefined) return;
    return `${formatEther(value)}${EtherSymbol}`;
  }
}

@Pipe({ name: 'ethCurrency' })
export class EthCurrencyPipe implements PipeTransform {
  constructor(@Optional() private chain?: ChainManager) {}
  async transform(value?: BigNumberish | null, chainId?: ChainId) {
    if (value === null || value === undefined) return;
    if (!this.chain) return `${formatEther(value)}${EtherSymbol}`;
    if (chainId) {
      const chain = await this.chain.getChain(chainId)
      return formatNativeCurrency(value, chain.nativeCurrency);
    }
    return this.chain.chain$.pipe(
      map(chain => formatNativeCurrency(value, chain.nativeCurrency))
    );
  }
}

@Pipe({ name: 'chain' })
export class ChainPipe implements PipeTransform {
  constructor(private chain: ChainManager) {}
  transform(chainId: ChainId) {
    return this.chain.getChain(chainId);
  }
}

@Pipe({ name: 'explore' })
export class ExplorePipe implements PipeTransform {
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

export const ethersPipes = [
  BigNumberPipe,
  EtherPipe, 
  EthCurrencyPipe,
  ExplorePipe,
  AddressPipe,
  SupportedChainPipe,
  ChainPipe,
];