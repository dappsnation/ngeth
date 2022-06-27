# Angular toolkit for ethers

## Getting Started
```
npm install @ngeth/ethers-core @ngeth/ethers-angular ethers
```

In the `app.module.ts` add the providers: 
```typescript
import { ngEthersProviders, EthersModule } from '@ngeth/ethers-angular';
import { InjectedProviders } form '@ngeth/ethers-core';

@NgModule({
  // Use EthersModule only for the pipes, directive or components
  imports: [BrowserModule, EthersModule],
  providers: [ngEthersProviders(InjectedProviders)]
})
```
This will exposes the `NgERC1193` provider

Use it in a component: 
```typescript
import { NgERC1193 } from '@ngeth/ethers-angular';
@Component({
  template: `
    <p *ngIf="account$ | async as account; else noAccount">{{ account | address }}</p>
    <ng-template #noAccount>
      <button (click)="connect()">Connect your wallet</button>
    </ng-template>
  `
})
export class AppComponent {
  account$ = this
  constructor(private erc1193: NgERC1193) {}
  connect() {
    this.erc1193.enable();
  }
}
```

## Install

Standalone
```
npm install @ngeth/ethers-core @ngeth/ethers-angular ethers
```

With `@ngeth/hardhat`
```
npx nx @ngeth/hardhat:ng-add --outputType angular
```

## Providers

#### SUPPORTED_CHAINS
Specify a list of supported chain for the application. If value is "*", all chains are supported
```
{ provide: SUPPORTED_CHAINS, useValue: [1] }
```

#### CUSTOM_CHAINS
Add a list of custom chains for the `ChainManager`. Useful for local development with hardhat for example
```
{ provide: CUSTOM_CHAINS, useValue: { '0x1234': { name: 'Custom Chain', chain: 'ETH',... } } }
```

#### rpcProvider
Utils function to set the ethers.js's `Provider` as injectable dependancy
```
providers: [rpcProvider()]
```

#### ngEthersProviders
Utils function to bind the `Provider` & `Signer` to the `NgERC1193` wallet manager
```
import { InjectedProviders } form '@ngeth/ethers-core';
...
providers: [
  ngEthersProviders(InjectedProviders)
]
```

## EthersModule
Provides useful components & pipes for an angular web3 project

```typescript
@NgModule({
  imports: [EthersModule]
})
```

### Components

#### `eth-blocky`
A blocky stuled representation of an address
```html
<eth-blocky address="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"></eth-blocky>
```

### Directives

#### `input[type="ethAddress"]`
A `ControlValueAccessor` for ethereum addresses
```html
<input type="ethAddress" [formControl]="control" />
```

#### `input[type="ether"]`
A `ControlValueAccessor` to transform an ether value into a BigNumber of wei
```html
<input type="ether" [formControl]="control" />
```

### Pipes

#### address
Checksum & format an ethereum address
```html
<!-- 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 -->
<p>{{ account | address }}</p>
<!-- 0xf39F...2266 -->
<p>{{ account | address:'short' }}</p>
```

#### bignumber
Transform a bignumber-like value into a string
```html
<p>{{ gasUsed | bignumber }}</p>
```

#### ether
Transform a bignumber-like value into a ether string using the ether symbol
```html
<p>{{ price | ether }}</p>
```

#### ethCurrency
Transform a bignumber-like value into a the native currency of a chain. It'll default to the current chain if not chainId is specified.
```html
<!-- Use the current selected chain -->
<p>{{ price | ethCurrency | async }}</p>
<!-- Support number or hex chainID -->
<p>{{ price | ethCurrency:1 | async }}</p>
<p>{{ price | ethCurrency:'0x01' | async }}</p>
```
_This is an async pipe because it relies on the chain metadata._

#### chain
Get the chain metadata of a chainId
```html
<menu>
  <ng-container *ngFor="let chainId of availableChainIds">
    <li *ngIf="chainId | chain | async as chain">
      <button (click)="select(chainId)">{{ chain.name }}</button>
    <li>
  </ng-container>
</menu>
```

#### explore
Link to the block explorer search of a specific chain
```html
<ng-container *ngIf="chainId$ | async as chainId">
  <article *ngIf="chainId | chain | async as chain">
    <a [href]="account | explorer:chain">
      <eth-blocky [address]="account"></eth-blocky>
      <h3>{{ account | address }}</h3>
    </a>
  </article>
</ng-container>
```

## Guards

#### HasInjectedProviderGuard
Check if the user has an injected provided by looking at `window.ethereum`
- Redirect to `/no-injected-provider`
- Custom redirect: `data.hasInjectedProviderRedirect`
```typescript
{
  path: 'account',
  canActivate: [HasInjectedProviderGuard],
  data: {
    hasInjectedProviderRedirect: '/get-provider'
  }
}
```

#### HasWalletGuard
Check if the user has an active erc1193 wallet selected. In the case of `InjectedProviders` it can be either MetaMask or Coinbase
- Redirect to: `/no-wallet`
- Custom redirect: `data.hasWalletRedirect`
```typescript
{
  path: 'wallet',
  canActivate: [HasWalletGuard],
  data: {
    hasWalletRedirect: '/get-wallet'
  }
}
```

#### IsConnectedGuard
Check if the user has a connected account
- Redirect to: `/no-connected`
- Custom redirect: `data.isConnectedRedirect`
```typescript
{
  path: 'wallet',
  canActivate: [IsConnectedGuard],
  data: {
    isConnectedRedirect: '/connect-to-metamask'
  }
}
```

#### HasSignerGuard
Check if the user has a connected account
- Redirect to: `/no-signer`
- Custom redirect: `data.hasSignerRedirect`
```typescript
{
  path: 'wallet',
  canActivate: [IsConnectedGuard],
  data: {
    hasSignerRedirect: '/select-account'
  }
}
```


#### IsSupportedChainGuard
Check if the current user chain is supported by the application
- Redirect to: `/unsupported-chain`
- Custom redirect: `data.isSupportedChainRedirect`
```typescript
@NgModule({
  imports: [
    RouterModule.forChild({
      path: '',
      canActivate: [IsSupportedChainGuard],
      data: {
        isSupportedChainRedirect: '/change-chain'
      }
    })
  ],
  providers: [
    { provide: SUPPORTED_CHAINS, useValue: [1] }
  ]
})
```
