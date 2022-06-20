var _ERC1193_ethersProvider, _ERC1193_ethersSigner, _ERC1193_wallet, _ERC1193_events;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { inject, NgZone } from '@angular/core';
import { getAddress } from '@ethersproject/address';
import { toChainId, toChainHex } from '@ngeth/ethers-core';
import { timer, of, combineLatest, defer, BehaviorSubject } from 'rxjs';
import { map, shareReplay, switchMap, filter } from 'rxjs/operators';
import { Web3Provider } from '@ethersproject/providers';
import { fromEthEvent } from '../events';
import { getChain } from '../chain';
import { fromChain } from './utils';
const errorCode = {
    4001: '[User Rejected Request] The user rejected the request.',
    4100: '[Unauthorized] 	The requested method and/or account has not been authorized by the user.',
    4200: '[Unsupported Method]	The Provider does not support the requested method.',
    4900: '[Disconnected] The Provider is disconnected from all chains.',
    4901: '[Chain Disconnected] The Provider is not connected to the requested chain.',
};
function exist(value) {
    return value !== undefined && value !== null;
}
export class ERC1193 {
    constructor() {
        this.zone = inject(NgZone);
        _ERC1193_ethersProvider.set(this, void 0);
        _ERC1193_ethersSigner.set(this, void 0);
        _ERC1193_wallet.set(this, new BehaviorSubject(null));
        _ERC1193_events.set(this, {});
        this.walletChanges = __classPrivateFieldGet(this, _ERC1193_wallet, "f").asObservable();
        /** Observe if current account is connected */
        this.connected$ = this.walletChanges.pipe(filter(exist), switchMap(wallet => {
            return combineLatest([
                this.fromEvent(wallet, 'connect', undefined),
                this.fromEvent(wallet, 'disconnect', undefined),
            ]);
        }), switchMap(() => {
            if (this.provider?.isConnected())
                return of(true);
            return timer(500).pipe(map(() => this.provider?.isConnected()));
        }), shareReplay({ refCount: true, bufferSize: 1 }));
        /**
         * First account connected to the dapp, if any
         * @note This might not be the selected account in Metamask
         */
        this.account$ = this.walletChanges.pipe(switchMap(wallet => wallet ? this.fromEvent(wallet, 'accountsChanged', []) : of(void 0)), switchMap(() => {
            if (this.account)
                return of([this.account]);
            return timer(500).pipe(map(() => (this.account ? [this.account] : [])));
        }), map(accounts => accounts.length ? getAddress(accounts[0]) : undefined), shareReplay({ refCount: true, bufferSize: 1 }));
        /**
         * Current account. Doesn't emit until therer is a connected account
         * @note ⚠️ Only use if you're sure there is an account (inside a guard for example)
         */
        this.currentAccount$ = this.account$.pipe(filter(exist));
        this.chainId$ = this.walletChanges.pipe(switchMap(wallet => wallet ? this.fromEvent(wallet, 'chainChanged', undefined) : of(void 0)), switchMap(() => {
            if (this.chainId)
                return of(this.chainId);
            return timer(500).pipe(map(() => this.chainId));
        }), filter(exist), map(chainId => toChainId(chainId)), shareReplay({ refCount: true, bufferSize: 1 }));
        this.message$ = this.walletChanges.pipe(filter(exist), switchMap(wallet => this.fromEvent(wallet, 'message')));
    }
    get ethersProvider() {
        return __classPrivateFieldGet(this, _ERC1193_ethersProvider, "f");
    }
    get ethersSigner() {
        return __classPrivateFieldGet(this, _ERC1193_ethersSigner, "f");
    }
    /** Listen on event from MetaMask Provider */
    fromEvent(wallet, event, initial) {
        if (!__classPrivateFieldGet(this, _ERC1193_events, "f")[event]) {
            __classPrivateFieldGet(this, _ERC1193_events, "f")[event] = defer(() => {
                return fromEthEvent(wallet.provider, this.zone, event, initial);
            });
        }
        return __classPrivateFieldGet(this, _ERC1193_events, "f")[event];
    }
    /** Select a wallet to setup the provider & signer */
    async selectWallet(wallet) {
        if (!wallet) {
            if (!this.wallets.length)
                throw new Error('No wallet provided or found');
            wallet = await this.getWallet();
            if (!wallet)
                throw new Error('No wallet selected');
        }
        if (wallet.provider !== this.provider) {
            __classPrivateFieldSet(this, _ERC1193_ethersProvider, new Web3Provider(wallet.provider), "f");
            __classPrivateFieldSet(this, _ERC1193_ethersSigner, __classPrivateFieldGet(this, _ERC1193_ethersProvider, "f").getSigner(), "f");
            __classPrivateFieldGet(this, _ERC1193_wallet, "f").next(wallet);
            this.provider = wallet.provider;
        }
    }
    /** Select a wallet and connect to it */
    async enable(wallet) {
        await this.selectWallet(wallet);
        if (!this.provider)
            throw new Error('No provider connected to ERC1193 service');
        return this.provider.request({ method: 'eth_requestAccounts' });
    }
    /**
     * Request user to change chain
     * @note If the error code (error.code) is 4902, then the requested chain has not been added by MetaMask, and you have to request to add it via addChain
     * @param id The 0x-non zero chainId or decimal number
     */
    switchChain(id) {
        const chainId = toChainHex(id);
        return this.provider?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }]
        });
    }
    async addChain(chain) {
        const params = (typeof chain === "string")
            ? await getChain(chain).then(fromChain)
            : chain;
        return this.provider?.request({
            method: 'wallet_addEthereumChain',
            params: [params]
        });
    }
    watchAsset(params) {
        return this.provider?.request({
            method: 'wallet_watchAsset',
            params: { type: 'ERC20', options: params }
        });
    }
}
_ERC1193_ethersProvider = new WeakMap(), _ERC1193_ethersSigner = new WeakMap(), _ERC1193_wallet = new WeakMap(), _ERC1193_events = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2V0aGVycy9hbmd1bGFyL3NyYy9saWIvZXJjMTE5My9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRXBELE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDM0QsT0FBTyxFQUFFLEtBQUssRUFBYyxFQUFFLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEYsT0FBTyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JFLE9BQU8sRUFBaUIsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdkUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN6QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFHcEMsTUFBTSxTQUFTLEdBQUc7SUFDaEIsSUFBSSxFQUFFLHdEQUF3RDtJQUM5RCxJQUFJLEVBQUUsMEZBQTBGO0lBQ2hHLElBQUksRUFBRSwwRUFBMEU7SUFDaEYsSUFBSSxFQUFFLDhEQUE4RDtJQUNwRSxJQUFJLEVBQUUsNEVBQTRFO0NBQ25GLENBQUE7QUFJRCxTQUFTLEtBQUssQ0FBSSxLQUFnQjtJQUNoQyxPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQztBQUMvQyxDQUFDO0FBR0QsTUFBTSxPQUFnQixPQUFPO0lBQTdCO1FBQ1UsU0FBSSxHQUFHLE1BQU0s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QUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0IsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBTztZQUNsQyxNQUFNLEVBQUUsNEJBQTRCO1lBQ3BDLE1BQU0sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUM7U0FDdEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBaUM7UUFDOUMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7WUFDeEMsQ0FBQyxDQUFDLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDdkMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNWLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQU87WUFDbEMsTUFBTSxFQUFFLHlCQUF5QjtZQUNqQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUM7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxNQUFtQztRQUM1QyxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFVO1lBQ3JDLE1BQU0sRUFBRSxtQkFBbUI7WUFDM0IsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFO1NBQzNDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluamVjdCwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGdldEFkZHJlc3MgfSBmcm9tICdAZXRoZXJzcHJvamVjdC9hZGRyZXNzJztcclxuaW1wb3J0IHsgQWRkQ2hhaW5QYXJhbWV0ZXIsIEVSQzExOTNFdmVudHMsIEVSQzExOTNQYXJhbSwgRVJDMTE5M1Byb3ZpZGVyLCBXYWxsZXRQcm9maWxlLCBXYXRjaEFzc2V0UGFyYW1zIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCB7IHRvQ2hhaW5JZCwgdG9DaGFpbkhleCB9IGZyb20gJ0BuZ2V0aC9ldGhlcnMtY29yZSc7XHJcbmltcG9ydCB7IHRpbWVyLCBPYnNlcnZhYmxlLCBvZiwgY29tYmluZUxhdGVzdCwgZGVmZXIsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAsIHNoYXJlUmVwbGF5LCBzd2l0Y2hNYXAsIGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgSnNvblJwY1NpZ25lciwgV2ViM1Byb3ZpZGVyIH0gZnJvbSAnQGV0aGVyc3Byb2plY3QvcHJvdmlkZXJzJztcclxuaW1wb3J0IHsgZnJvbUV0aEV2ZW50IH0gZnJvbSAnLi4vZXZlbnRzJztcclxuaW1wb3J0IHsgZ2V0Q2hhaW4gfSBmcm9tICcuLi9jaGFpbic7XHJcbmltcG9ydCB7IGZyb21DaGFpbiB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuXHJcbmNvbnN0IGVycm9yQ29kZSA9IHtcclxuICA0MDAxOlx0J1tVc2VyIFJlamVjdGVkIFJlcXVlc3RdIFRoZSB1c2VyIHJlamVjdGVkIHRoZSByZXF1ZXN0LicsXHJcbiAgNDEwMDpcdCdbVW5hdXRob3JpemVkXSBcdFRoZSByZXF1ZXN0ZWQgbWV0aG9kIGFuZC9vciBhY2NvdW50IGhhcyBub3QgYmVlbiBhdXRob3JpemVkIGJ5IHRoZSB1c2VyLicsXHJcbiAgNDIwMDpcdCdbVW5zdXBwb3J0ZWQgTWV0aG9kXVx0VGhlIFByb3ZpZGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlIHJlcXVlc3RlZCBtZXRob2QuJyxcclxuICA0OTAwOlx0J1tEaXNjb25uZWN0ZWRdIFRoZSBQcm92aWRlciBpcyBkaXNjb25uZWN0ZWQgZnJvbSBhbGwgY2hhaW5zLicsXHJcbiAgNDkwMTpcdCdbQ2hhaW4gRGlzY29ubmVjdGVkXSBUaGUgUHJvdmlkZXIgaXMgbm90IGNvbm5lY3RlZCB0byB0aGUgcmVxdWVzdGVkIGNoYWluLicsXHJcbn1cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZXhpc3Q8VD4odmFsdWU/OiBUIHwgbnVsbCk6IHZhbHVlIGlzIFQge1xyXG4gIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVSQzExOTM8V2FsbGV0IGV4dGVuZHMgV2FsbGV0UHJvZmlsZSA9IFdhbGxldFByb2ZpbGU+IHtcclxuICBwcml2YXRlIHpvbmUgPSBpbmplY3QoTmdab25lKTtcclxuICAjZXRoZXJzUHJvdmlkZXI/OiBXZWIzUHJvdmlkZXI7XHJcbiAgI2V0aGVyc1NpZ25lcj86IEpzb25ScGNTaWduZXI7XHJcbiAgI3dhbGxldCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8V2FsbGV0IHwgbnVsbD4obnVsbCk7XHJcbiAgI2V2ZW50czogUmVjb3JkPHN0cmluZywgT2JzZXJ2YWJsZTx1bmtub3duPj4gPSB7fTtcclxuXHJcbiAgd2FsbGV0Q2hhbmdlcyA9IHRoaXMuI3dhbGxldC5hc09ic2VydmFibGUoKTtcclxuICBcclxuICBwcm90ZWN0ZWQgcHJvdmlkZXI/OiBFUkMxMTkzUHJvdmlkZXI7XHJcbiAgYWJzdHJhY3QgYWNjb3VudD86IHN0cmluZztcclxuICBhYnN0cmFjdCBjaGFpbklkPzogbnVtYmVyO1xyXG4gIGFic3RyYWN0IHdhbGxldHM6IFdhbGxldFtdO1xyXG4gIC8qKiBNZXRob2QgdXNlZCB0byBhc2sgdGhlIHVzZXIgd2hpY2ggd2FsbGV0IHRvIHNlbGVjdCBpZiBtdWx0aXBsZSB3YWxsZXQgYXZhaWxhYmxlICovXHJcbiAgcHJvdGVjdGVkIGFic3RyYWN0IGdldFdhbGxldCgpOiBQcm9taXNlPFdhbGxldCB8IHVuZGVmaW5lZD47XHJcblxyXG4gIC8qKiBPYnNlcnZlIGlmIGN1cnJlbnQgYWNjb3VudCBpcyBjb25uZWN0ZWQgKi9cclxuICBjb25uZWN0ZWQkID0gdGhpcy53YWxsZXRDaGFuZ2VzLnBpcGUoXHJcbiAgICBmaWx0ZXIoZXhpc3QpLFxyXG4gICAgc3dpdGNoTWFwKHdhbGxldCA9PiB7XHJcbiAgICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFtcclxuICAgICAgICB0aGlzLmZyb21FdmVudCh3YWxsZXQsICdjb25uZWN0JywgdW5kZWZpbmVkKSxcclxuICAgICAgICB0aGlzLmZyb21FdmVudCh3YWxsZXQsICdkaXNjb25uZWN0JywgdW5kZWZpbmVkKSxcclxuICAgICAgXSlcclxuICAgIH0pLFxyXG4gICAgc3dpdGNoTWFwKCgpID0+IHtcclxuICAgICAgaWYgKHRoaXMucHJvdmlkZXI/LmlzQ29ubmVjdGVkKCkpIHJldHVybiBvZih0cnVlKTtcclxuICAgICAgcmV0dXJuIHRpbWVyKDUwMCkucGlwZShtYXAoKCkgPT4gdGhpcy5wcm92aWRlcj8uaXNDb25uZWN0ZWQoKSkpXHJcbiAgICB9KSxcclxuICAgIHNoYXJlUmVwbGF5KHsgcmVmQ291bnQ6IHRydWUsIGJ1ZmZlclNpemU6IDEgfSlcclxuICApO1xyXG4gICAgXHJcbiAgLyoqXHJcbiAgICogRmlyc3QgYWNjb3VudCBjb25uZWN0ZWQgdG8gdGhlIGRhcHAsIGlmIGFueVxyXG4gICAqIEBub3RlIFRoaXMgbWlnaHQgbm90IGJlIHRoZSBzZWxlY3RlZCBhY2NvdW50IGluIE1ldGFtYXNrXHJcbiAgICovXHJcbiAgYWNjb3VudCQgPSB0aGlzLndhbGxldENoYW5nZXMucGlwZShcclxuICAgIHN3aXRjaE1hcCh3YWxsZXQgPT4gd2FsbGV0ID8gdGhpcy5mcm9tRXZlbnQod2FsbGV0LCAnYWNjb3VudHNDaGFuZ2VkJywgW10pIDogb2Yodm9pZCAwKSksXHJcbiAgICBzd2l0Y2hNYXAoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5hY2NvdW50KSByZXR1cm4gb2YoW3RoaXMuYWNjb3VudF0pO1xyXG4gICAgICByZXR1cm4gdGltZXIoNTAwKS5waXBlKG1hcCgoKSA9PiAodGhpcy5hY2NvdW50ID8gW3RoaXMuYWNjb3VudF0gOiBbXSkpKTtcclxuICAgIH0pLFxyXG4gICAgbWFwKGFjY291bnRzID0+IGFjY291bnRzLmxlbmd0aCA/IGdldEFkZHJlc3MoYWNjb3VudHNbMF0pIDogdW5kZWZpbmVkKSxcclxuICAgIHNoYXJlUmVwbGF5KHsgcmVmQ291bnQ6IHRydWUsIGJ1ZmZlclNpemU6IDEgfSlcclxuICApO1xyXG5cclxuICAvKiogXHJcbiAgICogQ3VycmVudCBhY2NvdW50LiBEb2Vzbid0IGVtaXQgdW50aWwgdGhlcmVyIGlzIGEgY29ubmVjdGVkIGFjY291bnRcclxuICAgKiBAbm90ZSDimqDvuI8gT25seSB1c2UgaWYgeW91J3JlIHN1cmUgdGhlcmUgaXMgYW4gYWNjb3VudCAoaW5zaWRlIGEgZ3VhcmQgZm9yIGV4YW1wbGUpXHJcbiAgICovXHJcbiAgY3VycmVudEFjY291bnQkID0gdGhpcy5hY2NvdW50JC5waXBlKGZpbHRlcihleGlzdCkpO1xyXG5cclxuICBjaGFpbklkJCA9IHRoaXMud2FsbGV0Q2hhbmdlcy5waXBlKFxyXG4gICAgc3dpdGNoTWFwKHdhbGxldCA9PiB3YWxsZXQgPyB0aGlzLmZyb21FdmVudCh3YWxsZXQsICdjaGFpbkNoYW5nZWQnLCB1bmRlZmluZWQpIDogb2Yodm9pZCAwKSksXHJcbiAgICBzd2l0Y2hNYXAoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5jaGFpbklkKSByZXR1cm4gb2YodGhpcy5jaGFpbklkKTtcclxuICAgICAgcmV0dXJuIHRpbWVyKDUwMCkucGlwZShtYXAoKCkgPT4gdGhpcy5jaGFpbklkKSlcclxuICAgIH0pLFxyXG4gICAgZmlsdGVyKGV4aXN0KSxcclxuICAgIG1hcChjaGFpbklkID0+IHRvQ2hhaW5JZChjaGFpbklkKSksXHJcbiAgICBzaGFyZVJlcGxheSh7IHJlZkNvdW50OiB0cnVlLCBidWZmZXJTaXplOiAxIH0pXHJcbiAgKTtcclxuXHJcbiAgbWVzc2FnZSQgPSB0aGlzLndhbGxldENoYW5nZXMucGlwZShcclxuICAgIGZpbHRlcihleGlzdCksXHJcbiAgICBzd2l0Y2hNYXAod2FsbGV0ID0+IHRoaXMuZnJvbUV2ZW50KHdhbGxldCwgJ21lc3NhZ2UnKSksXHJcbiAgKTtcclxuXHJcbiAgZ2V0IGV0aGVyc1Byb3ZpZGVyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuI2V0aGVyc1Byb3ZpZGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGV0aGVyc1NpZ25lcigpIHtcclxuICAgIHJldHVybiB0aGlzLiNldGhlcnNTaWduZXI7XHJcbiAgfVxyXG5cclxuICAvKiogTGlzdGVuIG9uIGV2ZW50IGZyb20gTWV0YU1hc2sgUHJvdmlkZXIgKi9cclxuICBwcm90ZWN0ZWQgZnJvbUV2ZW50PEsgZXh0ZW5kcyBrZXlvZiBFUkMxMTkzRXZlbnRzPihcclxuICAgIHdhbGxldDogV2FsbGV0LFxyXG4gICAgZXZlbnQ6IEssXHJcbiAgICBpbml0aWFsPzogRVJDMTE5M1BhcmFtPEs+XHJcbiAgKTogT2JzZXJ2YWJsZTxFUkMxMTkzUGFyYW08Sz4+IHtcclxuICAgIGlmICghdGhpcy4jZXZlbnRzW2V2ZW50XSkge1xyXG4gICAgICB0aGlzLiNldmVudHNbZXZlbnRdID0gZGVmZXIoKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBmcm9tRXRoRXZlbnQ8RVJDMTE5M1BhcmFtPEs+Pih3YWxsZXQucHJvdmlkZXIsIHRoaXMuem9uZSwgZXZlbnQsIGluaXRpYWwpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLiNldmVudHNbZXZlbnRdIGFzIE9ic2VydmFibGU8RVJDMTE5M1BhcmFtPEs+PjtcclxuICB9XHJcblxyXG4gIC8qKiBTZWxlY3QgYSB3YWxsZXQgdG8gc2V0dXAgdGhlIHByb3ZpZGVyICYgc2lnbmVyICovXHJcbiAgYXN5bmMgc2VsZWN0V2FsbGV0KHdhbGxldD86IFdhbGxldCkge1xyXG4gICAgaWYgKCF3YWxsZXQpIHtcclxuICAgICAgaWYgKCF0aGlzLndhbGxldHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ05vIHdhbGxldCBwcm92aWRlZCBvciBmb3VuZCcpO1xyXG4gICAgICB3YWxsZXQgPSBhd2FpdCB0aGlzLmdldFdhbGxldCgpO1xyXG4gICAgICBpZiAoIXdhbGxldCkgdGhyb3cgbmV3IEVycm9yKCdObyB3YWxsZXQgc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICAgIGlmICh3YWxsZXQucHJvdmlkZXIgIT09IHRoaXMucHJvdmlkZXIpIHtcclxuICAgICAgdGhpcy4jZXRoZXJzUHJvdmlkZXIgPSBuZXcgV2ViM1Byb3ZpZGVyKHdhbGxldC5wcm92aWRlcik7XHJcbiAgICAgIHRoaXMuI2V0aGVyc1NpZ25lciA9IHRoaXMuI2V0aGVyc1Byb3ZpZGVyLmdldFNpZ25lcigpO1xyXG4gICAgICB0aGlzLiN3YWxsZXQubmV4dCh3YWxsZXQpO1xyXG4gICAgICB0aGlzLnByb3ZpZGVyID0gd2FsbGV0LnByb3ZpZGVyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIFNlbGVjdCBhIHdhbGxldCBhbmQgY29ubmVjdCB0byBpdCAqL1xyXG4gIGFzeW5jIGVuYWJsZSh3YWxsZXQ/OiBXYWxsZXQpOiBQcm9taXNlPHN0cmluZ1tdPiB7XHJcbiAgICBhd2FpdCB0aGlzLnNlbGVjdFdhbGxldCh3YWxsZXQpO1xyXG4gICAgaWYgKCF0aGlzLnByb3ZpZGVyKSB0aHJvdyBuZXcgRXJyb3IoJ05vIHByb3ZpZGVyIGNvbm5lY3RlZCB0byBFUkMxMTkzIHNlcnZpY2UnKTtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyLnJlcXVlc3QoeyBtZXRob2Q6ICdldGhfcmVxdWVzdEFjY291bnRzJyB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlcXVlc3QgdXNlciB0byBjaGFuZ2UgY2hhaW5cclxuICAgKiBAbm90ZSBJZiB0aGUgZXJyb3IgY29kZSAoZXJyb3IuY29kZSkgaXMgNDkwMiwgdGhlbiB0aGUgcmVxdWVzdGVkIGNoYWluIGhhcyBub3QgYmVlbiBhZGRlZCBieSBNZXRhTWFzaywgYW5kIHlvdSBoYXZlIHRvIHJlcXVlc3QgdG8gYWRkIGl0IHZpYSBhZGRDaGFpblxyXG4gICAqIEBwYXJhbSBpZCBUaGUgMHgtbm9uIHplcm8gY2hhaW5JZCBvciBkZWNpbWFsIG51bWJlclxyXG4gICAqL1xyXG4gIHN3aXRjaENoYWluKGlkOiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgIGNvbnN0IGNoYWluSWQgPSB0b0NoYWluSGV4KGlkKTtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyPy5yZXF1ZXN0PG51bGw+KHtcclxuICAgICAgbWV0aG9kOiAnd2FsbGV0X3N3aXRjaEV0aGVyZXVtQ2hhaW4nLFxyXG4gICAgICBwYXJhbXM6IFt7IGNoYWluSWQgfV1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgYWRkQ2hhaW4oY2hhaW46IEFkZENoYWluUGFyYW1ldGVyIHwgc3RyaW5nKSB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSAodHlwZW9mIGNoYWluID09PSBcInN0cmluZ1wiKVxyXG4gICAgICA/IGF3YWl0IGdldENoYWluKGNoYWluKS50aGVuKGZyb21DaGFpbilcclxuICAgICAgOiBjaGFpbjtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyPy5yZXF1ZXN0PG51bGw+KHtcclxuICAgICAgbWV0aG9kOiAnd2FsbGV0X2FkZEV0aGVyZXVtQ2hhaW4nLFxyXG4gICAgICBwYXJhbXM6IFtwYXJhbXNdXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHdhdGNoQXNzZXQocGFyYW1zOiBXYXRjaEFzc2V0UGFyYW1zWydvcHRpb25zJ10pIHtcclxuICAgIHJldHVybiB0aGlzLnByb3ZpZGVyPy5yZXF1ZXN0PGJvb2xlYW4+KHtcclxuICAgICAgbWV0aG9kOiAnd2FsbGV0X3dhdGNoQXNzZXQnLFxyXG4gICAgICBwYXJhbXM6IHsgdHlwZTogJ0VSQzIwJywgb3B0aW9uczogcGFyYW1zIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=