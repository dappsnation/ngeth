# DevX for Web3 developers

ngeth is a monorepo to improve devX for web3 :
- Typescript Contract Generator
- Local Block Explorer
- Local Etherscan API Emulator

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

- **Typescript Contract** are generated in folder `ngeth`
- **Local Block Explorer** is accessible on http://localhost:3001 
- **Local Etherscan API Emulator** is accessible on http://localhost:3000/etherscan
---------

## Explorer Packages :
- [`@ngeth/hardhat`](./packages/hardhat): Hardhat toolkit
- [`@ngeth/ethers-*`](./packages/ethers): Common pattern built on top of ethers.js
