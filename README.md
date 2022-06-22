# DevX for Web3 developers

---------
## Quick start
```
npm install --save-dev hardhat
npx hardhat
```
Select typescript project and **install the deps display on the terminal**
```
npm install --save-dev @ngeth/hardhat
```
Import `@ngeth/hardhat` in `hardhat.config.ts` : 
```typescript
import "@ngeth/hardhat";
```
Run :
```
npx hardhat ngeth:serve
```
Open http://localhost:3001 to see the local block explorer

Open folder `ngeth` to see the generated contracts
---------

Explorer Packages :
- [`@ngeth/hardhat`](./packages/hardhat): Hardhat toolkit
- [`@ngeth/ethers-*`](./packages/ethers): Common pattern built on top of ethers.js
- [`@ngeth/etherscan`](./packages/etherscan): Etherscan SDK
