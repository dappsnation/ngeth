import { Inject, Optional, Pipe } from '@angular/core';
import { BigNumber } from 'ethers';
import { getAddress } from '@ethersproject/address';
import { formatUnits, formatEther } from '@ethersproject/units';
import { EtherSymbol } from '@ethersproject/constants';
import { isBytes } from '@ethersproject/bytes';
import { explore, isSupportedChain } from '@ngeth/ethers-core';
import { ChainManager, SUPPORTED_CHAINS } from './chain';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./chain";
function formatNativeCurrency(value, currency) {
    const amount = formatUnits(value, currency.decimals);
    const symbol = currency.symbol ?? currency.name;
    return `${amount} ${symbol}`;
}
export class BigNumberPipe {
    transform(value) {
        if (value instanceof BigNumber)
            return value.toString();
        if (typeof value === 'bigint')
            return value.toString(10);
        if (typeof value === 'string')
            return value.startsWith('0x') ? parseInt(value) : value;
        if (isBytes(value))
            return new Uint8Array(value).toString(); // todo
        return BigNumber.from(value).toString();
    }
}
BigNumberPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: BigNumberPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
BigNumberPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: BigNumberPipe, name: "bignumber" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: BigNumberPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'bignumber' }]
        }] });
export class EtherPipe {
    transform(value) {
        if (value === null || value === undefined)
            return;
        return `${formatEther(value)} ${EtherSymbol}`;
    }
}
EtherPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EtherPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
EtherPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: EtherPipe, name: "ether" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EtherPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'ether' }]
        }] });
export class EthCurrencyPipe {
    constructor(chain) {
        this.chain = chain;
    }
    async transform(value, chainId) {
        if (value === null || value === undefined)
            return;
        if (!this.chain)
            return `${formatEther(value)}${EtherSymbol}`;
        if (chainId) {
            const chain = await this.chain.getChain(chainId);
            return formatNativeCurrency(value, chain.nativeCurrency);
        }
        return this.chain.chain$.pipe(map(chain => formatNativeCurrency(value, chain.nativeCurrency)));
    }
}
EthCurrencyPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthCurrencyPipe, deps: [{ token: i1.ChainManager, optional: true }], target: i0.ɵɵFactoryTarget.Pipe });
EthCurrencyPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: EthCurrencyPipe, name: "ethCurrency" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthCurrencyPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'ethCurrency' }]
        }], ctorParameters: function () { return [{ type: i1.ChainManager, decorators: [{
                    type: Optional
                }] }]; } });
export class ChainPipe {
    constructor(chain) {
        this.chain = chain;
    }
    transform(chainId) {
        return this.chain.getChain(chainId);
    }
}
ChainPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChainPipe, deps: [{ token: i1.ChainManager }], target: i0.ɵɵFactoryTarget.Pipe });
ChainPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: ChainPipe, name: "chain" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChainPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'chain' }]
        }], ctorParameters: function () { return [{ type: i1.ChainManager }]; } });
export class ExplorePipe {
    transform(search, chain) {
        return explore(chain, search);
    }
}
ExplorePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ExplorePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
ExplorePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: ExplorePipe, name: "explore" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ExplorePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'explore' }]
        }] });
export class SupportedChainPipe {
    constructor(supportedChains) {
        this.supportedChains = supportedChains;
    }
    transform(chainId) {
        return isSupportedChain(chainId, this.supportedChains);
    }
}
SupportedChainPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: SupportedChainPipe, deps: [{ token: SUPPORTED_CHAINS }], target: i0.ɵɵFactoryTarget.Pipe });
SupportedChainPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: SupportedChainPipe, name: "supportedChain" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: SupportedChainPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'supportedChain' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [SUPPORTED_CHAINS]
                }] }]; } });
export class AddressPipe {
    transform(address, format = 'full') {
        const account = getAddress(address);
        if (format === 'short')
            return `${account.slice(0, 6)}...${account.slice(-4)}`;
        return account;
    }
}
AddressPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: AddressPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
AddressPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: AddressPipe, name: "address" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: AddressPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'address' }]
        }] });
export const ethersPipes = [
    BigNumberPipe,
    EtherPipe,
    EthCurrencyPipe,
    ExplorePipe,
    AddressPipe,
    SupportedChainPipe,
    ChainPipe,
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL3BpcGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDdEUsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxRQUFRLENBQUM7QUFDakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3BELE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvQyxPQUFPLEVBQWlDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBbUIsTUFBTSxvQkFBb0IsQ0FBQztBQUMvRyxPQUFPLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3pELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBRXJDLFNBQVMsb0JBQW9CLENBQUMsS0FBbUIsRUFBRSxRQUF1QjtJQUN4RSxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDaEQsT0FBTyxHQUFHLE1BQU0sSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUMvQixDQUFDO0FBR0QsTUFBTSxPQUFPLGFBQWE7SUFDeEIsU0FBUyxDQUFDLEtBQW1CO1FBQzNCLElBQUksS0FBSyxZQUFZLFNBQVM7WUFBRSxPQUFPLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4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QUM3QixZQUE4QyxlQUFnQztRQUFoQyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7SUFBRyxDQUFDO0lBQ2xGLFNBQVMsQ0FBQyxPQUF3QjtRQUNoQyxPQUFPLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDekQsQ0FBQzs7K0dBSlUsa0JBQWtCLGtCQUNULGdCQUFnQjs2R0FEekIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBRDlCLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7OzBCQUVqQixNQUFNOzJCQUFDLGdCQUFnQjs7QUFPdEMsTUFBTSxPQUFPLFdBQVc7SUFDdEIsU0FBUyxDQUFDLE9BQWUsRUFBRSxTQUEyQixNQUFNO1FBQzFELE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxJQUFJLE1BQU0sS0FBSyxPQUFPO1lBQUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQy9FLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7O3dHQUxVLFdBQVc7c0dBQVgsV0FBVzsyRkFBWCxXQUFXO2tCQUR2QixJQUFJO21CQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTs7QUFTekIsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHO0lBQ3pCLGFBQWE7SUFDYixTQUFTO0lBQ1QsZUFBZTtJQUNmLFdBQVc7SUFDWCxXQUFXO0lBQ1gsa0JBQWtCO0lBQ2xCLFNBQVM7Q0FDVixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBPcHRpb25hbCwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmlnTnVtYmVyLCBCaWdOdW1iZXJpc2ggfSBmcm9tICdldGhlcnMnO1xuaW1wb3J0IHsgZ2V0QWRkcmVzcyB9IGZyb20gJ0BldGhlcnNwcm9qZWN0L2FkZHJlc3MnO1xuaW1wb3J0IHsgZm9ybWF0VW5pdHMsIGZvcm1hdEV0aGVyIH0gZnJvbSAnQGV0aGVyc3Byb2plY3QvdW5pdHMnO1xuaW1wb3J0IHsgRXRoZXJTeW1ib2wgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9jb25zdGFudHMnO1xuaW1wb3J0IHsgaXNCeXRlcyB9IGZyb20gJ0BldGhlcnNwcm9qZWN0L2J5dGVzJztcbmltcG9ydCB7IENoYWluLCBDaGFpbkN1cnJlbmN5LCBDaGFpbklkLCBleHBsb3JlLCBpc1N1cHBvcnRlZENoYWluLCBTdXBwb3J0ZWRDaGFpbnMgfSBmcm9tICdAbmdldGgvZXRoZXJzLWNvcmUnO1xuaW1wb3J0IHsgQ2hhaW5NYW5hZ2VyLCBTVVBQT1JURURfQ0hBSU5TIH0gZnJvbSAnLi9jaGFpbic7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmZ1bmN0aW9uIGZvcm1hdE5hdGl2ZUN1cnJlbmN5KHZhbHVlOiBCaWdOdW1iZXJpc2gsIGN1cnJlbmN5OiBDaGFpbkN1cnJlbmN5KSB7XG4gIGNvbnN0IGFtb3VudCA9IGZvcm1hdFVuaXRzKHZhbHVlLCBjdXJyZW5jeS5kZWNpbWFscyk7XG4gIGNvbnN0IHN5bWJvbCA9IGN1cnJlbmN5LnN5bWJvbCA/PyBjdXJyZW5jeS5uYW1lO1xuICByZXR1cm4gYCR7YW1vdW50fSAke3N5bWJvbH1gO1xufVxuXG5AUGlwZSh7IG5hbWU6ICdiaWdudW1iZXInIH0pXG5leHBvcnQgY2xhc3MgQmlnTnVtYmVyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWU6IEJpZ051bWJlcmlzaCkge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJpZ051bWJlcikgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2JpZ2ludCcpIHJldHVybiB2YWx1ZS50b1N0cmluZygxMCk7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHJldHVybiB2YWx1ZS5zdGFydHNXaXRoKCcweCcpID8gcGFyc2VJbnQodmFsdWUpIDogdmFsdWU7XG4gICAgaWYgKGlzQnl0ZXModmFsdWUpKSByZXR1cm4gbmV3IFVpbnQ4QXJyYXkodmFsdWUpLnRvU3RyaW5nKCk7IC8vIHRvZG9cbiAgICByZXR1cm4gQmlnTnVtYmVyLmZyb20odmFsdWUpLnRvU3RyaW5nKCk7XG4gIH1cbn1cblxuQFBpcGUoeyBuYW1lOiAnZXRoZXInIH0pXG5leHBvcnQgY2xhc3MgRXRoZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh2YWx1ZT86IEJpZ051bWJlcmlzaCB8IG51bGwpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIHJldHVybiBgJHtmb3JtYXRFdGhlcih2YWx1ZSl9ICR7RXRoZXJTeW1ib2x9YDtcbiAgfVxufVxuXG5AUGlwZSh7IG5hbWU6ICdldGhDdXJyZW5jeScgfSlcbmV4cG9ydCBjbGFzcyBFdGhDdXJyZW5jeVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgcHJpdmF0ZSBjaGFpbj86IENoYWluTWFuYWdlcikge31cbiAgYXN5bmMgdHJhbnNmb3JtKHZhbHVlPzogQmlnTnVtYmVyaXNoIHwgbnVsbCwgY2hhaW5JZD86IENoYWluSWQpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIGlmICghdGhpcy5jaGFpbikgcmV0dXJuIGAke2Zvcm1hdEV0aGVyKHZhbHVlKX0ke0V0aGVyU3ltYm9sfWA7XG4gICAgaWYgKGNoYWluSWQpIHtcbiAgICAgIGNvbnN0IGNoYWluID0gYXdhaXQgdGhpcy5jaGFpbi5nZXRDaGFpbihjaGFpbklkKVxuICAgICAgcmV0dXJuIGZvcm1hdE5hdGl2ZUN1cnJlbmN5KHZhbHVlLCBjaGFpbi5uYXRpdmVDdXJyZW5jeSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNoYWluLmNoYWluJC5waXBlKFxuICAgICAgbWFwKGNoYWluID0+IGZvcm1hdE5hdGl2ZUN1cnJlbmN5KHZhbHVlLCBjaGFpbi5uYXRpdmVDdXJyZW5jeSkpXG4gICAgKTtcbiAgfVxufVxuXG5AUGlwZSh7IG5hbWU6ICdjaGFpbicgfSlcbmV4cG9ydCBjbGFzcyBDaGFpblBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjaGFpbjogQ2hhaW5NYW5hZ2VyKSB7fVxuICB0cmFuc2Zvcm0oY2hhaW5JZDogQ2hhaW5JZCkge1xuICAgIHJldHVybiB0aGlzLmNoYWluLmdldENoYWluKGNoYWluSWQpO1xuICB9XG59XG5cbkBQaXBlKHsgbmFtZTogJ2V4cGxvcmUnIH0pXG5leHBvcnQgY2xhc3MgRXhwbG9yZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKHNlYXJjaDogc3RyaW5nLCBjaGFpbjogQ2hhaW4pIHtcbiAgICByZXR1cm4gZXhwbG9yZShjaGFpbiwgc2VhcmNoKTtcbiAgfVxufVxuXG5AUGlwZSh7IG5hbWU6ICdzdXBwb3J0ZWRDaGFpbicgfSlcbmV4cG9ydCBjbGFzcyBTdXBwb3J0ZWRDaGFpblBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgY29uc3RydWN0b3IoQEluamVjdChTVVBQT1JURURfQ0hBSU5TKSBwcml2YXRlIHN1cHBvcnRlZENoYWluczogU3VwcG9ydGVkQ2hhaW5zKSB7fVxuICB0cmFuc2Zvcm0oY2hhaW5JZDogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzU3VwcG9ydGVkQ2hhaW4oY2hhaW5JZCwgdGhpcy5zdXBwb3J0ZWRDaGFpbnMpO1xuICB9XG59XG5cbkBQaXBlKHsgbmFtZTogJ2FkZHJlc3MnIH0pXG5leHBvcnQgY2xhc3MgQWRkcmVzc1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKGFkZHJlc3M6IHN0cmluZywgZm9ybWF0OiAnc2hvcnQnIHwgJ2Z1bGwnID0gJ2Z1bGwnKSB7XG4gICAgY29uc3QgYWNjb3VudCA9IGdldEFkZHJlc3MoYWRkcmVzcyk7XG4gICAgaWYgKGZvcm1hdCA9PT0gJ3Nob3J0JykgcmV0dXJuIGAke2FjY291bnQuc2xpY2UoMCwgNil9Li4uJHthY2NvdW50LnNsaWNlKC00KX1gO1xuICAgIHJldHVybiBhY2NvdW50O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBldGhlcnNQaXBlcyA9IFtcbiAgQmlnTnVtYmVyUGlwZSxcbiAgRXRoZXJQaXBlLCBcbiAgRXRoQ3VycmVuY3lQaXBlLFxuICBFeHBsb3JlUGlwZSxcbiAgQWRkcmVzc1BpcGUsXG4gIFN1cHBvcnRlZENoYWluUGlwZSxcbiAgQ2hhaW5QaXBlLFxuXTsiXX0=