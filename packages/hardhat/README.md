# @ngeth/hardhat

`@ngeth/hardhat` helps you **setup** hardhat for an angular project and **generates** typescript classes that you can use for your angular services.

## Install
```
ng add @ngeth/hardhat
```

The command above might be **very** slow for some reason. Use this to go faster
```
npm install @ngeth/hardhat
ng generate @ngeth/hardhat:ng-add
```


### Openzeppelin
`@ngeth/hardhat` doesn't comes with openzeppelin by default.
You can install it by doing : 
```
npm install @openzeppelin/contracts
```

## How to use
1. Under `contracts/`: Add your solidity contracts.
2. Under `hardhat.config.ts`: Add the contracts you want to auto deploy under `ngeth.autoDeploy`.
3. Run `ng hardhat-serve`.
4. Under `src/app/contracts`: See the **generated** contracts and addresses.
5. Create a service : 

```typescript
import { Injectable } from '@angular/core';
import { ERC20Contract, addresses } from './contracts';
import { MetaMask } from '@ngeth/ethers-angular';

@Injectable({ providedIn: 'root' })
export class ERC20 extends ERC20Contract {
  constructor(metamask: MetaMask) {
    super(addresses.ERC20, metamask.getSigner());
  }
}
```
For more details see `@ngeth/ethers`.


## Tasks / Builder
`@ngeth/hardhat` comes with 3 custom hardhat tasks.
If you use `ng add`, the schematics will creates builders inside your workspace that wrap these tasks:

`hardhat ngeth:build` (`@ngeth/hardhat:build`):
- **compiles** the contracts
- **generates** the contract classes

`hardhat ngeth:serve` (`@ngeth/hardhat:serve`): 
- **compiles** the contracts.
- **generates** the contract classes.
- **runs** a node on localhost.
- **deploys** the contracts under `ngeth.autoDeploy` in `hardhat.config.ts`.

`hardhat ngeth:test` (`@ngeth/hardhat:test`):
- **compiles** the contracts.
- **tests** with jest.

_If you want to test with mocha, use the regular `hardhat test` task._

## Troubleshoot

### Invalid chainId
This is an issue with metamask and hardhat
https://hardhat.org/metamask-issue.html

### Invalid nonce
This is an issue with metamask not beeing able to reset the nonce to 0 when you restart the node
Go to Metamask > Setting > Advanced > Reset Account