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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9ldGhlcnMvYW5ndWxhci9zcmMvbGliL3BpcGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDdEUsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxRQUFRLENBQUM7QUFDakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3BELE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvQyxPQUFPLEVBQWlDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBbUIsTUFBTSxvQkFBb0IsQ0FBQztBQUMvRyxPQUFPLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3pELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBRXJDLFNBQVMsb0JBQW9CLENBQUMsS0FBbUIsRUFBRSxRQUF1QjtJQUN4RSxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDaEQsT0FBTyxHQUFHLE1BQU0sSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUMvQixDQUFDO0FBR0QsTUFBTSxPQUFPLGFBQWE7SUFDeEIsU0FBUyxDQUFDLEtBQW1CO1FBQzNCLElBQUksS0FBSyxZQUFZLFNBQVM7WUFBRSxPQUFPLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4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QUM3QixZQUE4QyxlQUFnQztRQUFoQyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7SUFBRyxDQUFDO0lBQ2xGLFNBQVMsQ0FBQyxPQUF3QjtRQUNoQyxPQUFPLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDekQsQ0FBQzs7K0dBSlUsa0JBQWtCLGtCQUNULGdCQUFnQjs2R0FEekIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBRDlCLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7OzBCQUVqQixNQUFNOzJCQUFDLGdCQUFnQjs7QUFPdEMsTUFBTSxPQUFPLFdBQVc7SUFDdEIsU0FBUyxDQUFDLE9BQWUsRUFBRSxTQUEyQixNQUFNO1FBQzFELE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxJQUFJLE1BQU0sS0FBSyxPQUFPO1lBQUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQy9FLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7O3dHQUxVLFdBQVc7c0dBQVgsV0FBVzsyRkFBWCxXQUFXO2tCQUR2QixJQUFJO21CQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTs7QUFTekIsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHO0lBQ3pCLGFBQWE7SUFDYixTQUFTO0lBQ1QsZUFBZTtJQUNmLFdBQVc7SUFDWCxXQUFXO0lBQ1gsa0JBQWtCO0lBQ2xCLFNBQVM7Q0FDVixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBPcHRpb25hbCwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCaWdOdW1iZXIsIEJpZ051bWJlcmlzaCB9IGZyb20gJ2V0aGVycyc7XHJcbmltcG9ydCB7IGdldEFkZHJlc3MgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9hZGRyZXNzJztcclxuaW1wb3J0IHsgZm9ybWF0VW5pdHMsIGZvcm1hdEV0aGVyIH0gZnJvbSAnQGV0aGVyc3Byb2plY3QvdW5pdHMnO1xyXG5pbXBvcnQgeyBFdGhlclN5bWJvbCB9IGZyb20gJ0BldGhlcnNwcm9qZWN0L2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IGlzQnl0ZXMgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9ieXRlcyc7XHJcbmltcG9ydCB7IENoYWluLCBDaGFpbkN1cnJlbmN5LCBDaGFpbklkLCBleHBsb3JlLCBpc1N1cHBvcnRlZENoYWluLCBTdXBwb3J0ZWRDaGFpbnMgfSBmcm9tICdAbmdldGgvZXRoZXJzLWNvcmUnO1xyXG5pbXBvcnQgeyBDaGFpbk1hbmFnZXIsIFNVUFBPUlRFRF9DSEFJTlMgfSBmcm9tICcuL2NoYWluJztcclxuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuZnVuY3Rpb24gZm9ybWF0TmF0aXZlQ3VycmVuY3kodmFsdWU6IEJpZ051bWJlcmlzaCwgY3VycmVuY3k6IENoYWluQ3VycmVuY3kpIHtcclxuICBjb25zdCBhbW91bnQgPSBmb3JtYXRVbml0cyh2YWx1ZSwgY3VycmVuY3kuZGVjaW1hbHMpO1xyXG4gIGNvbnN0IHN5bWJvbCA9IGN1cnJlbmN5LnN5bWJvbCA/PyBjdXJyZW5jeS5uYW1lO1xyXG4gIHJldHVybiBgJHthbW91bnR9ICR7c3ltYm9sfWA7XHJcbn1cclxuXHJcbkBQaXBlKHsgbmFtZTogJ2JpZ251bWJlcicgfSlcclxuZXhwb3J0IGNsYXNzIEJpZ051bWJlclBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0odmFsdWU6IEJpZ051bWJlcmlzaCkge1xyXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQmlnTnVtYmVyKSByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdiaWdpbnQnKSByZXR1cm4gdmFsdWUudG9TdHJpbmcoMTApO1xyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHJldHVybiB2YWx1ZS5zdGFydHNXaXRoKCcweCcpID8gcGFyc2VJbnQodmFsdWUpIDogdmFsdWU7XHJcbiAgICBpZiAoaXNCeXRlcyh2YWx1ZSkpIHJldHVybiBuZXcgVWludDhBcnJheSh2YWx1ZSkudG9TdHJpbmcoKTsgLy8gdG9kb1xyXG4gICAgcmV0dXJuIEJpZ051bWJlci5mcm9tKHZhbHVlKS50b1N0cmluZygpO1xyXG4gIH1cclxufVxyXG5cclxuQFBpcGUoeyBuYW1lOiAnZXRoZXInIH0pXHJcbmV4cG9ydCBjbGFzcyBFdGhlclBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0odmFsdWU/OiBCaWdOdW1iZXJpc2ggfCBudWxsKSB7XHJcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgcmV0dXJuIGAke2Zvcm1hdEV0aGVyKHZhbHVlKX0gJHtFdGhlclN5bWJvbH1gO1xyXG4gIH1cclxufVxyXG5cclxuQFBpcGUoeyBuYW1lOiAnZXRoQ3VycmVuY3knIH0pXHJcbmV4cG9ydCBjbGFzcyBFdGhDdXJyZW5jeVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBwcml2YXRlIGNoYWluPzogQ2hhaW5NYW5hZ2VyKSB7fVxyXG4gIGFzeW5jIHRyYW5zZm9ybSh2YWx1ZT86IEJpZ051bWJlcmlzaCB8IG51bGwsIGNoYWluSWQ/OiBDaGFpbklkKSB7XHJcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgaWYgKCF0aGlzLmNoYWluKSByZXR1cm4gYCR7Zm9ybWF0RXRoZXIodmFsdWUpfSR7RXRoZXJTeW1ib2x9YDtcclxuICAgIGlmIChjaGFpbklkKSB7XHJcbiAgICAgIGNvbnN0IGNoYWluID0gYXdhaXQgdGhpcy5jaGFpbi5nZXRDaGFpbihjaGFpbklkKVxyXG4gICAgICByZXR1cm4gZm9ybWF0TmF0aXZlQ3VycmVuY3kodmFsdWUsIGNoYWluLm5hdGl2ZUN1cnJlbmN5KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmNoYWluLmNoYWluJC5waXBlKFxyXG4gICAgICBtYXAoY2hhaW4gPT4gZm9ybWF0TmF0aXZlQ3VycmVuY3kodmFsdWUsIGNoYWluLm5hdGl2ZUN1cnJlbmN5KSlcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5AUGlwZSh7IG5hbWU6ICdjaGFpbicgfSlcclxuZXhwb3J0IGNsYXNzIENoYWluUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2hhaW46IENoYWluTWFuYWdlcikge31cclxuICB0cmFuc2Zvcm0oY2hhaW5JZDogQ2hhaW5JZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hhaW4uZ2V0Q2hhaW4oY2hhaW5JZCk7XHJcbiAgfVxyXG59XHJcblxyXG5AUGlwZSh7IG5hbWU6ICdleHBsb3JlJyB9KVxyXG5leHBvcnQgY2xhc3MgRXhwbG9yZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0oc2VhcmNoOiBzdHJpbmcsIGNoYWluOiBDaGFpbikge1xyXG4gICAgcmV0dXJuIGV4cGxvcmUoY2hhaW4sIHNlYXJjaCk7XHJcbiAgfVxyXG59XHJcblxyXG5AUGlwZSh7IG5hbWU6ICdzdXBwb3J0ZWRDaGFpbicgfSlcclxuZXhwb3J0IGNsYXNzIFN1cHBvcnRlZENoYWluUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoU1VQUE9SVEVEX0NIQUlOUykgcHJpdmF0ZSBzdXBwb3J0ZWRDaGFpbnM6IFN1cHBvcnRlZENoYWlucykge31cclxuICB0cmFuc2Zvcm0oY2hhaW5JZDogc3RyaW5nIHwgbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gaXNTdXBwb3J0ZWRDaGFpbihjaGFpbklkLCB0aGlzLnN1cHBvcnRlZENoYWlucyk7XHJcbiAgfVxyXG59XHJcblxyXG5AUGlwZSh7IG5hbWU6ICdhZGRyZXNzJyB9KVxyXG5leHBvcnQgY2xhc3MgQWRkcmVzc1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0oYWRkcmVzczogc3RyaW5nLCBmb3JtYXQ6ICdzaG9ydCcgfCAnZnVsbCcgPSAnZnVsbCcpIHtcclxuICAgIGNvbnN0IGFjY291bnQgPSBnZXRBZGRyZXNzKGFkZHJlc3MpO1xyXG4gICAgaWYgKGZvcm1hdCA9PT0gJ3Nob3J0JykgcmV0dXJuIGAke2FjY291bnQuc2xpY2UoMCwgNil9Li4uJHthY2NvdW50LnNsaWNlKC00KX1gO1xyXG4gICAgcmV0dXJuIGFjY291bnQ7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZXRoZXJzUGlwZXMgPSBbXHJcbiAgQmlnTnVtYmVyUGlwZSxcclxuICBFdGhlclBpcGUsIFxyXG4gIEV0aEN1cnJlbmN5UGlwZSxcclxuICBFeHBsb3JlUGlwZSxcclxuICBBZGRyZXNzUGlwZSxcclxuICBTdXBwb3J0ZWRDaGFpblBpcGUsXHJcbiAgQ2hhaW5QaXBlLFxyXG5dOyJdfQ==