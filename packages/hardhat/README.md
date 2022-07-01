# @ngeth/hardhat


`@ngeth/hardhat` is a collection of hardhat task that comes with : 
- Contract type generation for ethers
- Script runner when local node boots up for better E2E tests
- Local Block Explorer app
- Local API endpoint to emulate common cloud services (only etherscan is supported yet)

_Note: `@ngeth/hardhat` is built for **Typescript** project._

**Nx support**: `@ngeth/hardhat` is built with nx and provides schematics and builders for a better nx integration.


## Install
```
npm install @ngeth/hardhat
```

### Setup with Nx or Angular

Update an existing project
```
ng generate @ngeth/hardhat:ng-add
```
_Note: Prefer the command above over `ng add @ngeth/hardhat` which might be **very** slow._

Create a dedicated library
```
ng generate @ngeth/hardhat:library contracts
```

#### Options: 
- `outputType`: `"angular" | "typescript"` (default: "typescript")


### Setup without Nx
Setup a hardhat project following [official documentation](https://hardhat.org/getting-started).

Update `hardhat.config.ts`
```typescript
import '@nomiclabs/hardhat-ethers';
import '@ngeth/hardhat'; // <-- load @ngeth/hardhat

export default {
  solidity: '0.8.11',
  paths: {
    sources: './contracts',
    tests: './tests',
    artifacts: './artifacts',
  },
  // Config for @ngeth/hardhat
  ngeth: {
    outputPath: './src',
    runs: ['scripts/deploy.ts'],
    explorer: {
      api: 3000,
      app: 3001
    },
  },
};
```

### Run Scripts
The field `runs` let you run scripts before `ngeth:serve`. This is very handy to create an initial state for your local app development. Let's see how to deploy a contract and save its address in the `outputPath` directory: 

`scripts/deploy.ts`
```typescript
import * as hre from 'hardhat';
import { deploy, saveAddresses } from '@ngeth/hardhat';

async function main() {
  // Deploy contract from the artifacts by their names & constructor arguments
  const addresses = await deploy(hre, {
    BaseERC721: [],
    BaseERC20: ['SYB', 'Name'],
  });
  // Save the addresses of the contracts in the outputPath directory
  await saveAddresses(hre, addresses);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

The addresses output will be a json file with the addresses by chain. This format is useful to manage addresses for contract from different chains.

`addresses.json`
```json
{
  "hardhat": {
    "BaseERC721": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "BaseERC20": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  }
}
```

## Config

#### `outputPath`
- **description**: Directory, relative to `hardhat.config.ts`, to put generated contracts classes
- **required**: Yes
- **type**: `string`

#### `outputType`
- **description**: Type of generated contracts
- **required**: No
- **type**: `'angular' | 'typescript'`
- **default**: `'typescript'`

#### `runs`
- **description**: Scripts to run on `@ngeth:serve` after node has started. If array of string, parallel is `false`
- **required**: No
- **type**: `string[] | { scripts: string[], parallel: boolean }`
- **default**: `[]`

#### `explorer`
- **description**: Ports used for the block explorer API and APP.
- **required**: No
- **type**: `false | { api: number, app: number }`
- **default**: `{ api: 3000, app: 3001 }`

#### `withImports`
- **description**: Generate Typescript interfaces for libraries & contract imported by the exported contracts
- **required**: No
- **type**: `boolean`
- **default**: `false`

## Tasks / Builder
`@ngeth/hardhat` comes with 3 custom hardhat tasks.
If you use Nx or Angular, the schematics will create builders inside your workspace that wrap these tasks:

#### `hardhat ngeth:build` (`@ngeth/hardhat:build`):
- **compiles** the contracts
- **generates** the contract classes

#### `hardhat ngeth:serve` (`@ngeth/hardhat:serve`): 
- **compiles** the contracts.
- **generates** the contract classes.
- **starts** a node on localhost:8545, and the explorer as specified in the [config](#explorer)
- **runs** scripts specified under `runs`.

#### `hardhat ngeth:test` (`@ngeth/hardhat:test`):
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