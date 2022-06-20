import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, HostBinding, Input, inject, NgZone, Injectable, InjectionToken, Inject, Optional, forwardRef, Directive, HostListener, ViewChild, Pipe, NgModule, Injector, LOCALE_ID } from '@angular/core';
import * as i2 from '@angular/common';
import { CommonModule, formatNumber } from '@angular/common';
import blockies from 'blockies';
import { NG_VALUE_ACCESSOR, NgControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatUnits, parseUnits, formatEther } from '@ethersproject/units';
import { toChainId, toChainHex, defaultCustomChains, explore, isSupportedChain, EthersContract } from '@ngeth/ethers-core';
import * as i1 from '@ethersproject/providers';
import { Web3Provider, Provider as Provider$1, getDefaultProvider } from '@ethersproject/providers';
import { __classPrivateFieldGet, __classPrivateFieldSet } from 'tslib';
import { getAddress, isAddress } from '@ethersproject/address';
import { Observable, BehaviorSubject, combineLatest, of, timer, defer, from, map as map$1, scan, startWith, finalize, shareReplay as shareReplay$1, tap } from 'rxjs';
import { filter, switchMap, map, shareReplay } from 'rxjs/operators';
import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { BigNumber } from '@ethersproject/bignumber';
import { BigNumber as BigNumber$1 } from 'ethers';
import { EtherSymbol } from '@ethersproject/constants';
import { isBytes } from '@ethersproject/bytes';
import * as i1$1 from '@angular/router';

class BlockiesComponent {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    set address(address) {
        if (!address)
            return;
        this.title = address;
        if (this.previous)
            this.renderer.removeChild(this.el.nativeElement, this.previous);
        const { width, height } = this.el.nativeElement.getBoundingClientRect();
        this.previous = blockies({ seed: address.toLowerCase() });
        this.previous.style.width = `${width || 32}px`;
        this.previous.style.height = `${height || 32}px`;
        this.renderer.appendChild(this.el.nativeElement, this.previous);
    }
}
BlockiesComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: BlockiesComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
BlockiesComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: BlockiesComponent, selector: "eth-blockies", inputs: { address: "address" }, host: { properties: { "title": "this.title" } }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, styles: [":host{display:inline-block;overflow:hidden;border-radius:50%;aspect-ratio:1;line-height:0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: BlockiesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'eth-blockies', template: '<ng-content></ng-content>', changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:inline-block;overflow:hidden;border-radius:50%;aspect-ratio:1;line-height:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { title: [{
                type: HostBinding,
                args: ['title']
            }], address: [{
                type: Input
            }] } });

function fromEthEvent(provider, zone, event, initial) {
    return new Observable((subscriber) => {
        if (arguments.length === 4)
            zone.run(() => subscriber.next(initial));
        const handler = (...args) => {
            zone.run(() => subscriber.next(1 < args.length ? args : args[0]));
        };
        provider.addListener(event, handler);
        return () => provider.removeListener(event, handler);
    });
}

function fromChain(chain) {
    return ({
        chainId: `0x${chain.chainId.toString(16)}`,
        chainName: chain.name,
        nativeCurrency: chain.nativeCurrency,
        rpcUrls: chain.rpc,
        blockExplorerUrls: chain.explorers.map(explorer => explorer.url),
        iconUrls: []
    });
}

var _ERC1193_ethersProvider, _ERC1193_ethersSigner, _ERC1193_wallet, _ERC1193_events;
const errorCode = {
    4001: '[User Rejected Request] The user rejected the request.',
    4100: '[Unauthorized] 	The requested method and/or account has not been authorized by the user.',
    4200: '[Unsupported Method]	The Provider does not support the requested method.',
    4900: '[Disconnected] The Provider is disconnected from all chains.',
    4901: '[Chain Disconnected] The Provider is not connected to the requested chain.',
};
function exist$1(value) {
    return value !== undefined && value !== null;
}
class ERC1193 {
    constructor() {
        this.zone = inject(NgZone);
        _ERC1193_ethersProvider.set(this, void 0);
        _ERC1193_ethersSigner.set(this, void 0);
        _ERC1193_wallet.set(this, new BehaviorSubject(null));
        _ERC1193_events.set(this, {});
        this.walletChanges = __classPrivateFieldGet(this, _ERC1193_wallet, "f").asObservable();
        /** Observe if current account is connected */
        this.connected$ = this.walletChanges.pipe(filter(exist$1), switchMap(wallet => {
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
        this.currentAccount$ = this.account$.pipe(filter(exist$1));
        this.chainId$ = this.walletChanges.pipe(switchMap(wallet => wallet ? this.fromEvent(wallet, 'chainChanged', undefined) : of(void 0)), switchMap(() => {
            if (this.chainId)
                return of(this.chainId);
            return timer(500).pipe(map(() => this.chainId));
        }), filter(exist$1), map(chainId => toChainId(chainId)), shareReplay({ refCount: true, bufferSize: 1 }));
        this.message$ = this.walletChanges.pipe(filter(exist$1), switchMap(wallet => this.fromEvent(wallet, 'message')));
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

function ethersProviders(erc1193) {
    return [{
            provide: ERC1193,
            useClass: erc1193
        }, {
            provide: Provider,
            useFactory: (erc1193) => erc1193.ethersProvider,
            deps: [ERC1193]
        }, {
            provide: Signer,
            useFactory: (erc1193) => erc1193.ethersSigner,
            deps: [ERC1193]
        }];
}

function toInjectedWallet(provider) {
    if (provider.isMetaMask)
        return { label: 'MetaMask', provider };
    if (provider.isCoinbaseWallet)
        return { label: 'Coinbase', provider };
    return { label: 'Unknown', provider };
}
function getInjectedProviders() {
    const ethereum = window.ethereum;
    if (!ethereum)
        return [];
    if (Array.isArray(ethereum.providers) && ethereum.providers.length) {
        return Array.from(new Set(ethereum.providers));
    }
    return [ethereum];
}
class InjectedProviders extends ERC1193 {
    constructor() {
        super();
        this.wallets = getInjectedProviders().map(toInjectedWallet);
        if (this.wallets.length === 1)
            this.selectWallet(this.wallets[0]);
    }
    async getWallet() {
        if (!this.wallets.length)
            return;
        if (this.wallets.length === 1)
            return this.wallets[0];
        const labels = this.wallets.map(w => w.label);
        const res = prompt(`Which wallet do you want to use ? ${labels.join(', ')}`);
        const wallet = this.wallets.find(w => w.label.toLowerCase() === res?.toLowerCase());
        if (!wallet)
            alert(`"${res}" is not part of options: ${labels.join(', ')}`);
        return wallet;
    }
    get account() {
        if (!this.provider?.selectedAddress)
            return;
        return getAddress(this.provider.selectedAddress);
    }
    get chainId() {
        if (!this.provider?.chainId)
            return;
        return toChainId(this.provider.chainId);
    }
}
InjectedProviders.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: InjectedProviders, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
InjectedProviders.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: InjectedProviders, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: InjectedProviders, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return []; } });

const CUSTOM_CHAINS = new InjectionToken('Custom Chains to use instead of https://github.com/ethereum-lists/chains', {
    providedIn: 'root',
    factory: () => defaultCustomChains
});
const SUPPORTED_CHAINS = new InjectionToken('List of supported chains', {
    providedIn: 'root',
    factory: () => '*'
});
function exist(value) {
    return value !== undefined && value !== null;
}
function getChain(chainId) {
    const id = toChainId(chainId); // transform into decimals
    const url = `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${id}.json`;
    return fetch(url).then(res => res.json());
}
function getChainIcons(name, format) {
    const url = `https://github.com/ethereum-lists/chains/blob/master/_data/icons/${name}.json`;
    return fetch(url)
        .then(res => res.json())
        .then((icons) => {
        if (!format)
            return icons[0];
        return icons.find(icon => icon.format === format) ?? icons[0];
    });
}
class ChainManager {
    constructor(provider, customChains, erc1193) {
        this.provider = provider;
        this.customChains = customChains;
        this.erc1193 = erc1193;
        this.chains = {};
        this.icons = {};
        this.chain$ = defer(() => {
            const source = this.erc1193 ? this.erc1193.chainId$ : from(this.currentChain());
            return source;
        }).pipe(filter(exist), switchMap(chainId => this.getChain(chainId)));
    }
    async currentChain() {
        if (this.erc1193)
            return this.erc1193.chainId;
        return this.provider.getNetwork().then(network => network.chainId);
    }
    async getChain(chainId) {
        chainId = chainId ?? await this.currentChain();
        if (!chainId)
            throw new Error('No chainId provided');
        const id = toChainHex(chainId);
        if (id in this.customChains)
            return this.customChains[id];
        if (!this.chains[id]) {
            this.chains[id] = await getChain(id);
        }
        return this.chains[id];
    }
    async getIcon(name, format) {
        const key = format ? `${name}_${format}` : name;
        if (!this.icons[key]) {
            this.icons[key] = await getChainIcons(name, format);
        }
        return this.icons[key];
    }
    async explore(search, chainId) {
        chainId = chainId ?? await this.currentChain();
        if (!chainId)
            throw new Error('No chainId provided');
        const chain = await this.getChain(chainId);
        return explore(chain, search);
    }
}
ChainManager.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChainManager, deps: [{ token: i1.Provider }, { token: CUSTOM_CHAINS }, { token: ERC1193, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ChainManager.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChainManager, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChainManager, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Provider }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CUSTOM_CHAINS]
                }] }, { type: ERC1193, decorators: [{
                    type: Optional
                }] }]; } });

class EtherInputDirective {
    constructor(chainManager, renderer, el) {
        this.chainManager = chainManager;
        this.renderer = renderer;
        this.el = el;
        this.onChange = () => null;
        this.onTouch = () => null;
    }
    set chainId(id) {
        this.setChain(id);
    }
    change(event) {
        this.onChange(event.target.value);
    }
    blur() {
        this.onTouch();
    }
    setProperty(key, value) {
        this.renderer.setProperty(this.el.nativeElement, key, value);
    }
    async setChain(id) {
        this.chain = id
            ? await this.chainManager.getChain(id)
            : await this.chainManager.getChain();
    }
    get decimals() {
        return this.chain?.nativeCurrency.decimals;
    }
    async writeValue(value) {
        if (value) {
            this.setProperty('value', formatUnits(value, this.chain?.nativeCurrency.decimals));
        }
        else {
            this.setProperty('value', '');
        }
    }
    registerOnChange(fn) {
        this.onChange = (value) => {
            fn(parseUnits(value, this.decimals));
        };
    }
    registerOnTouched(fn) {
        this.onTouch = fn;
    }
    setDisabledState(isDisabled) {
        this.setProperty('disabled', isDisabled);
    }
}
EtherInputDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EtherInputDirective, deps: [{ token: ChainManager }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
EtherInputDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.2", type: EtherInputDirective, selector: "input[type=\"ether\"]", inputs: { chainId: "chainId" }, host: { listeners: { "change": "change($event)", "blur": "blur()" } }, providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EtherInputDirective),
            multi: true
        }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EtherInputDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="ether"]',
                    providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => EtherInputDirective),
                            multi: true
                        }],
                }]
        }], ctorParameters: function () { return [{ type: ChainManager }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; }, propDecorators: { chainId: [{
                type: Input
            }], change: [{
                type: HostListener,
                args: ['change', ['$event']]
            }], blur: [{
                type: HostListener,
                args: ['blur']
            }] } });

const address = (control) => {
    if (isAddress(control.value))
        return null;
    return { address: true };
};
function ownToken(tokenIds) {
    return (control) => {
        if (tokenIds.includes(control.value))
            return null;
        return { ownToken: { owned: tokenIds, actual: control.value } };
    };
}
function ownTokenAmount(tokens) {
    return (control) => {
        const { tokenId, amount } = control.value;
        const quantity = typeof amount === 'number' ? BigNumber.from(amount) : amount;
        if (tokens[tokenId].gt(quantity))
            return null;
        return {
            ownTokenAmount: {
                owned: tokens[tokenId] ?? BigNumber.from(0),
                actual: control.value
            }
        };
    };
}
const EthValidators = {
    address,
    ownToken,
    ownTokenAmount,
};

class AddressInputDirective {
    constructor(renderer, el, injector) {
        this.renderer = renderer;
        this.el = el;
        this.injector = injector;
        this.onChange = () => null;
        this.onTouch = () => null;
    }
    change(event) {
        this.onChange(event.target.value);
    }
    blur() {
        this.onTouch();
    }
    ngOnInit() {
        this.control = this.injector.get(NgControl)?.control;
        this.control?.addValidators(EthValidators.address);
    }
    setProperty(key, value) {
        this.renderer.setProperty(this.el.nativeElement, key, value);
    }
    async writeValue(value) {
        if (value) {
            this.setProperty('value', getAddress(value));
        }
        else {
            this.setProperty('value', '');
        }
    }
    registerOnChange(fn) {
        this.onChange = (value) => {
            this.control?.markAsDirty();
            fn(getAddress(value));
        };
    }
    registerOnTouched(fn) {
        this.onTouch = fn;
    }
    setDisabledState(isDisabled) {
        this.setProperty('disabled', isDisabled);
    }
}
AddressInputDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: AddressInputDirective, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Directive });
AddressInputDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.2", type: AddressInputDirective, selector: "input[type=\"ethAddress\"]", host: { listeners: { "change": "change($event)", "blur": "blur()" } }, providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AddressInputDirective),
            multi: true
        }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: AddressInputDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="ethAddress"]',
                    providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => AddressInputDirective),
                            multi: true
                        }],
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.Injector }]; }, propDecorators: { change: [{
                type: HostListener,
                args: ['change', ['$event']]
            }], blur: [{
                type: HostListener,
                args: ['blur']
            }] } });

class EthConnectComponent {
    constructor(erc1193) {
        this.erc1193 = erc1193;
        this.wallets = this.erc1193.wallets;
        this.account$ = this.erc1193.account$;
        this.connected$ = this.erc1193.connected$;
    }
    select(wallet) {
        this.erc1193.selectWallet(wallet);
    }
    enable() {
        if (this.wallets.length === 1)
            return this.erc1193.enable();
        return this.selectDialog.nativeElement.showModal();
    }
}
EthConnectComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthConnectComponent, deps: [{ token: ERC1193 }], target: i0.ɵɵFactoryTarget.Component });
EthConnectComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.2", type: EthConnectComponent, selector: "eth-connect", viewQueries: [{ propertyName: "selectDialog", first: true, predicate: ["selectDialog"], descendants: true }], ngImport: i0, template: "<ng-container *ngIf=\"wallets.length; else noProvider\">\n  <ng-container *ngIf=\"account$ | async as account; else connect\">\n    {{ account }}\n  </ng-container>\n</ng-container>\n\n<ng-template #noProvider>\n  <button>Create an account</button>\n</ng-template>\n<ng-template #connect>\n  <button (click)=\"enable()\">Select Wallet</button>\n</ng-template>\n\n<dialog #selectDialog>\n  <form method=\"dialog\">\n    <header>\n      <h2>Providers</h2>\n      <button>close</button>\n    </header>\n    <ul>\n      <li *ngFor=\"let wallet of wallets\">\n        <button (click)=\"select(wallet)\">{{ wallet.label }}</button>\n      </li>\n    </ul>\n  </form>\n</dialog>", styles: ["dialog{padding:0;border-radius:var(--size-1);background-color:var(--background-1);border:1px solid var(--foreground-4)}dialog header{display:flex;align-items:center;padding:var(--size-2);background-color:var(--background-0)}dialog ul{margin:0;padding:var(--size-2);list-style:none;display:grid;gap:var(--size-2)}dialog ul li{margin:0}dialog footer{display:flex;align-items:center;justify-content:flex-end;padding:var(--size-2)}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthConnectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'eth-connect', changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-container *ngIf=\"wallets.length; else noProvider\">\n  <ng-container *ngIf=\"account$ | async as account; else connect\">\n    {{ account }}\n  </ng-container>\n</ng-container>\n\n<ng-template #noProvider>\n  <button>Create an account</button>\n</ng-template>\n<ng-template #connect>\n  <button (click)=\"enable()\">Select Wallet</button>\n</ng-template>\n\n<dialog #selectDialog>\n  <form method=\"dialog\">\n    <header>\n      <h2>Providers</h2>\n      <button>close</button>\n    </header>\n    <ul>\n      <li *ngFor=\"let wallet of wallets\">\n        <button (click)=\"select(wallet)\">{{ wallet.label }}</button>\n      </li>\n    </ul>\n  </form>\n</dialog>", styles: ["dialog{padding:0;border-radius:var(--size-1);background-color:var(--background-1);border:1px solid var(--foreground-4)}dialog header{display:flex;align-items:center;padding:var(--size-2);background-color:var(--background-0)}dialog ul{margin:0;padding:var(--size-2);list-style:none;display:grid;gap:var(--size-2)}dialog ul li{margin:0}dialog footer{display:flex;align-items:center;justify-content:flex-end;padding:var(--size-2)}\n"] }]
        }], ctorParameters: function () { return [{ type: ERC1193 }]; }, propDecorators: { selectDialog: [{
                type: ViewChild,
                args: ['selectDialog']
            }] } });

const ethersComponents = [EtherInputDirective, BlockiesComponent, AddressInputDirective, EthConnectComponent];

function formatNativeCurrency(value, currency) {
    const amount = formatUnits(value, currency.decimals);
    const symbol = currency.symbol ?? currency.name;
    return `${amount} ${symbol}`;
}
class BigNumberPipe {
    transform(value) {
        if (value instanceof BigNumber$1)
            return value.toString();
        if (typeof value === 'bigint')
            return value.toString(10);
        if (typeof value === 'string')
            return value.startsWith('0x') ? parseInt(value) : value;
        if (isBytes(value))
            return new Uint8Array(value).toString(); // todo
        return BigNumber$1.from(value).toString();
    }
}
BigNumberPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: BigNumberPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
BigNumberPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: BigNumberPipe, name: "bignumber" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: BigNumberPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'bignumber' }]
        }] });
class EtherPipe {
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
class EthCurrencyPipe {
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
EthCurrencyPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthCurrencyPipe, deps: [{ token: ChainManager, optional: true }], target: i0.ɵɵFactoryTarget.Pipe });
EthCurrencyPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: EthCurrencyPipe, name: "ethCurrency" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthCurrencyPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'ethCurrency' }]
        }], ctorParameters: function () { return [{ type: ChainManager, decorators: [{
                    type: Optional
                }] }]; } });
class ChainPipe {
    constructor(chain) {
        this.chain = chain;
    }
    transform(chainId) {
        return this.chain.getChain(chainId);
    }
}
ChainPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChainPipe, deps: [{ token: ChainManager }], target: i0.ɵɵFactoryTarget.Pipe });
ChainPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: ChainPipe, name: "chain" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ChainPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'chain' }]
        }], ctorParameters: function () { return [{ type: ChainManager }]; } });
class ExplorePipe {
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
class SupportedChainPipe {
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
class AddressPipe {
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
const ethersPipes = [
    BigNumberPipe,
    EtherPipe,
    EthCurrencyPipe,
    ExplorePipe,
    AddressPipe,
    SupportedChainPipe,
    ChainPipe,
];

class EthersModule {
}
EthersModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthersModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
EthersModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: EthersModule, declarations: [BigNumberPipe, EtherPipe, EthCurrencyPipe, ExplorePipe, AddressPipe, SupportedChainPipe, ChainPipe, EtherInputDirective, BlockiesComponent, AddressInputDirective, EthConnectComponent], imports: [CommonModule], exports: [BigNumberPipe, EtherPipe, EthCurrencyPipe, ExplorePipe, AddressPipe, SupportedChainPipe, ChainPipe, EtherInputDirective, BlockiesComponent, AddressInputDirective, EthConnectComponent] });
EthersModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthersModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: EthersModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [...ethersPipes, ...ethersComponents],
                    exports: [...ethersPipes, ...ethersComponents],
                    imports: [CommonModule],
                }]
        }] });

function getEventTag(filter) {
    const emptyTopics = !filter.topics || !filter.topics.length;
    if (filter.address && emptyTopics)
        return '*';
    const address = filter.address ?? '*';
    const topics = (filter.topics ?? []).map((topic) => Array.isArray(topic) ? topic.join('|') : topic);
    return `${address}:${topics}`;
}
function flattenEvents(events) {
    const record = {};
    for (const event of events) {
        record[event.transactionHash] = event;
    }
    return Object.values(record);
}
class NgContract extends EthersContract {
    constructor(address, abi, signer, ngZone) {
        super(address, abi, signer);
        this._events = {};
        this.ngZone = ngZone ?? inject(NgZone);
    }
    /** Transform event name into an EventFilter */
    getEventFilter(name) {
        if (name === 'error')
            throw new Error('"error" event is not implemented yet');
        if (name === 'event')
            throw new Error('"event" event is not implemented yet');
        if (name === '*')
            throw new Error('"*" event is not implemented yet');
        const fragment = this.interface.getEvent(name);
        const topic = this.interface.getEventTopic(fragment);
        return { address: this.address, topics: [topic] };
    }
    wrapEvent(log) {
        const { name, signature, args, eventFragment } = this.interface.parseLog(log);
        return {
            ...log,
            getBlock: () => this.provider.getBlock(log.blockHash),
            getTransaction: () => this.provider.getTransaction(log.transactionHash),
            getTransactionReceipt: () => this.provider.getTransactionReceipt(log.transactionHash),
            decode: (data, topics) => {
                return this.interface.decodeEventLog(eventFragment, data, topics);
            },
            event: name,
            eventSignature: signature,
            args: args
        };
    }
    /**
     * Listen on the changes of an event, starting with the current state
     * @param event The event filter
     */
    from(event) {
        if (!this.provider)
            throw new Error('Provider required for event');
        const eventFilter = typeof event === 'string'
            ? this.getEventFilter(event)
            : event;
        const topic = eventFilter.topics?.[0];
        if (typeof topic !== 'string')
            throw new Error('Invalid topic');
        const tag = getEventTag(eventFilter);
        if (!this._events[tag]) {
            const initial = this.queryFilter(eventFilter);
            const listener = fromEthEvent(this.provider, this.ngZone, eventFilter).pipe(map$1(log => this.wrapEvent(log)), scan((acc, value) => acc.concat(value), []), startWith([]));
            this._events[tag] = combineLatest([
                from(initial),
                listener,
            ]).pipe(map$1(([events, last]) => [...events, ...last]), map$1(flattenEvents), // remove duplicated (events seems to have a cache of 2 somehow...)
            finalize(() => delete this._events[tag]), // remove cache when no subscriber remains
            shareReplay$1({ refCount: true, bufferSize: 1 }));
        }
        return this._events[tag];
    }
}

class ContractsManager {
    constructor() {
        this.contracts = {};
        this.injector = inject(Injector);
        this.zone = inject(NgZone);
    }
    get signer() {
        return this.injector.get(Signer);
    }
    get(address, chainId) {
        if (!this.contracts[chainId])
            this.contracts[chainId] = {};
        if (!this.contracts[chainId][address]) {
            this.contracts[chainId][address] = this.createInstance(address);
        }
        return this.contracts[chainId][address];
    }
}
ContractsManager.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ContractsManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ContractsManager.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ContractsManager });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ContractsManager, decorators: [{
            type: Injectable
        }] });

function formatERC20(balance, metadata, digitInfo, locale) {
    const base = BigNumber.from(10).pow(metadata.decimals);
    const amount = balance.div(base);
    const value = formatNumber(amount.toNumber(), locale || 'en', digitInfo);
    return `${value} ${metadata.symbol}`;
}
function parseERC20(amount, metadata) {
    const value = typeof amount === 'string' ? parseInt(amount) : amount;
    const base = BigNumber.from(10).pow(metadata.decimals);
    return BigNumber.from(value).mul(base);
}

class ERC20Pipe {
    constructor(_locale) {
        this._locale = _locale;
    }
    transform(balance, metadata, digitInfo) {
        return formatERC20(balance, metadata, digitInfo, this._locale);
    }
}
ERC20Pipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ERC20Pipe, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Pipe });
ERC20Pipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: ERC20Pipe, name: "erc20" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ERC20Pipe, decorators: [{
            type: Pipe,
            args: [{ name: 'erc20' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });

class ERC20Module {
}
ERC20Module.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ERC20Module, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ERC20Module.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.2", ngImport: i0, type: ERC20Module, declarations: [ERC20Pipe], imports: [CommonModule], exports: [ERC20Pipe] });
ERC20Module.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ERC20Module, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: ERC20Module, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ERC20Pipe],
                    exports: [ERC20Pipe],
                    imports: [CommonModule]
                }]
        }] });

class ERC20FormTransfer extends FormGroup {
    constructor(value = {}) {
        super({
            to: new FormControl(value.to, [Validators.required, EthValidators.address]),
            amount: new FormControl(value.amount, [Validators.min(0)]),
        });
    }
    setBalance(amount) {
        this.get('amount')?.addValidators(Validators.max(amount));
    }
}

class ERC721FormTransfer extends FormGroup {
    constructor(value = {}) {
        super({
            from: new FormControl(value.from, [EthValidators.address]),
            to: new FormControl(value.to, [Validators.required, EthValidators.address]),
            tokenId: new FormControl(value.tokenId, [Validators.required]),
        });
    }
    setTokens(tokenIds) {
        this.get('tokenId')?.addValidators(EthValidators.ownToken(tokenIds));
    }
}
class ERC721FormMint extends FormGroup {
    constructor(value = {}) {
        super({
            to: new FormControl(value.to, [Validators.required, EthValidators.address]),
            tokenId: new FormControl(value.tokenId, [Validators.required]),
            uri: new FormControl(value.uri, [Validators.required]),
        });
    }
}

class ERC1155FormTransfer extends FormGroup {
    constructor(value = {}) {
        super({
            from: new FormControl(value.from, [EthValidators.address]),
            to: new FormControl(value.to, [Validators.required, EthValidators.address]),
            tokenId: new FormControl(value.tokenId, [Validators.required]),
            amount: new FormControl(value.amount, [Validators.required, Validators.min(0)])
        });
    }
    setTokens(tokens) {
        this.addValidators(EthValidators.ownTokenAmount(tokens));
    }
}
class ERC1155FormMint extends FormGroup {
    constructor(value = {}) {
        super({
            to: new FormControl(value.to, [Validators.required, EthValidators.address]),
            tokenId: new FormControl(value.tokenId, [Validators.required]),
            amount: new FormControl(value.amount, [Validators.required]),
            uri: new FormControl(value.uri),
            data: new FormControl(value.data)
        });
    }
}

class HasInjectedProviderGuard {
    constructor(router) {
        this.router = router;
    }
    canActivate(route, state) {
        if ('ethereum' in window)
            return true;
        this.previous = state.url;
        const redirect = route.data['hasInjectedProviderRedirect'] ?? '/no-injected-provider';
        // Navigate to avoid next guard to run
        return this.router.navigate([redirect]);
    }
}
HasInjectedProviderGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasInjectedProviderGuard, deps: [{ token: i1$1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
HasInjectedProviderGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasInjectedProviderGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasInjectedProviderGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1$1.Router }]; } });
class HasWalletGuard {
    constructor(erc1193, router) {
        this.erc1193 = erc1193;
        this.router = router;
    }
    canActivate(route, state) {
        if (this.erc1193.wallets.length)
            return true;
        this.previous = state.url;
        const redirect = route.data['hasWalletRedirect'] ?? '/no-wallet';
        // Navigate to avoid next guard to run
        return this.router.navigate([redirect]);
    }
}
HasWalletGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasWalletGuard, deps: [{ token: ERC1193 }, { token: i1$1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
HasWalletGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasWalletGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasWalletGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: ERC1193 }, { type: i1$1.Router }]; } });
class IsSupportedChainGuard {
    constructor(router, erc1193, supportedChains) {
        this.router = router;
        this.erc1193 = erc1193;
        this.supportedChains = supportedChains;
    }
    canActivate(route, state) {
        this.previous = state.url;
        if (this.supportedChains === '*')
            return true;
        if (!this.erc1193.chainId)
            return false;
        const chainIndex = toChainId(this.erc1193.chainId);
        if (this.supportedChains.includes(chainIndex))
            return true;
        const redirect = route.data['isSupportedChainRedirect'] ?? '/unsupported-chain';
        return this.router.navigate([redirect]);
    }
}
IsSupportedChainGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsSupportedChainGuard, deps: [{ token: i1$1.Router }, { token: ERC1193 }, { token: SUPPORTED_CHAINS }], target: i0.ɵɵFactoryTarget.Injectable });
IsSupportedChainGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsSupportedChainGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsSupportedChainGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1$1.Router }, { type: ERC1193 }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SUPPORTED_CHAINS]
                }] }]; } });
class IsConnectedGuard {
    constructor(router, erc1193) {
        this.router = router;
        this.erc1193 = erc1193;
    }
    canActivate(route, state) {
        this.previous = state.url;
        const redirect = route.data['isConnectedRedirect'] ?? '/not-connected';
        return this.erc1193.connected$.pipe(map$1(isConnected => isConnected || this.router.parseUrl(redirect)));
    }
}
IsConnectedGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsConnectedGuard, deps: [{ token: i1$1.Router }, { token: ERC1193 }], target: i0.ɵɵFactoryTarget.Injectable });
IsConnectedGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsConnectedGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: IsConnectedGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1$1.Router }, { type: ERC1193 }]; } });
class HasSignerGuard {
    constructor(router, erc1193) {
        this.router = router;
        this.erc1193 = erc1193;
    }
    canActivate(route, state) {
        this.previous = state.url;
        const redirect = route.data['hasSignerRedirect'] ?? '/no-signer';
        return this.erc1193.account$.pipe(tap(console.log), map$1(account => !!account || this.router.parseUrl(redirect)));
    }
}
HasSignerGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasSignerGuard, deps: [{ token: i1$1.Router }, { token: ERC1193 }], target: i0.ɵɵFactoryTarget.Injectable });
HasSignerGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasSignerGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.2", ngImport: i0, type: HasSignerGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1$1.Router }, { type: ERC1193 }]; } });

function rpcProvider(network, options) {
    return { provide: Provider$1, useFactory: () => getDefaultProvider(network, options) };
}

/**
 * Generated bundle index. Do not edit.
 */

export { AddressInputDirective, AddressPipe, BigNumberPipe, BlockiesComponent, CUSTOM_CHAINS, ChainManager, ChainPipe, ContractsManager, ERC1155FormMint, ERC1155FormTransfer, ERC1193, ERC20FormTransfer, ERC20Module, ERC20Pipe, ERC721FormMint, ERC721FormTransfer, EthConnectComponent, EthCurrencyPipe, EthValidators, EtherInputDirective, EtherPipe, EthersModule, ExplorePipe, HasInjectedProviderGuard, HasSignerGuard, HasWalletGuard, InjectedProviders, IsConnectedGuard, IsSupportedChainGuard, NgContract, SUPPORTED_CHAINS, SupportedChainPipe, address, ethersComponents, ethersPipes, ethersProviders, formatERC20, fromEthEvent, getChain, getChainIcons, ownToken, ownTokenAmount, parseERC20, rpcProvider };
//# sourceMappingURL=ngeth-ethers-angular.mjs.map
