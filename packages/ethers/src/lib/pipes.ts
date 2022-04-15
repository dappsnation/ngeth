import { Inject, Pipe, PipeTransform } from '@angular/core';
import { BigNumber, BigNumberish } from 'ethers';
import { getAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
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

@Pipe({ name: 'eth' })
export class EthPipe implements PipeTransform {
  constructor(private chain: ChainManager) {}
  transform(value: BigNumberish, chainId?: ChainId) {
    if (chainId) {
      return this.chain.getChain(chainId)
        .then(chain => formatNativeCurrency(value, chain.nativeCurrency));
    }
    return this.chain.chain$.pipe(
      map(chain => formatNativeCurrency(value, chain.nativeCurrency))
    );
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