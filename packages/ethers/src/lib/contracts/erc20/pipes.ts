import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { BigNumber } from 'ethers';
import { ERC20Metadata } from './types';
import { formatERC20 } from '../utils';


@Pipe({ name: 'erc20' })
export class ERC20Pipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string) {}
  transform(balance: BigNumber, metadata: ERC20Metadata, digitInfo?: string) {
    return formatERC20(balance, metadata, digitInfo, this._locale)
  }
}