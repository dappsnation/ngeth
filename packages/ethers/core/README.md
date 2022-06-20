# ethers-core

Provide common pattern around ethers.js

## EthersContract
Super strongly typed contract built around the ethers.js `Contract`.

It's mainly used by `@ngeth/hardhat` output:
```typescript
interface ERC20Events {
  events: {
    Approval: (owner: string, spender: string, value: BigNumber) => void;
    Transfer: (from: string, to: string, value: BigNumber) => void;
  };
  filters: {
    Approval: (owner?: FilterParam<string>, spender?: FilterParam<string>) => TypedFilter<"Approval">;
    Transfer: (from?: FilterParam<string>, to?: FilterParam<string>) => TypedFilter<"Transfer">;
  };
  queries: {
    Approval: { owner: string; spender: string; value: BigNumber };
    Transfer: { from: string; to: string; value: BigNumber };
  };
}

class ERC20 extends EthersContract<ERC20Events> {}
```

`EthersContract` keeps track of the filters :
```typescript
const erc20 = new ERC20(address, abi);
const mint = erc20.filters.Transfer(constant.AddressZero);
const events = await erc20.queryFilter(mint);
// Typescript knows that initialOwners is string[]
const initialOwners = events.map(event => event.args.to);
```

## Tokens
Common operation on tokens: 

#### `erc20Balance(received: Event[], sent: Event[]): BigNumber`
Calculate balance of user based on Transfer events. Useful to get the balance at a specific block.
```typescript
const receivedFilter = erc20.filters.Transfer(undefined, address);
const sentFilter = erc20.filters.Transfer(address);
const [received, sent] = await Promise.all([
  erc20.queryFilter(receivedFilter, fromBlock, toBlock),
  erc20.queryFilter(sentFilter, fromBlock, toBlock),
]);
const balance = erc20Balance(received, sent);
```

#### `erc721Tokens(received: Event[], sent: Event[]): string[]`
Returns the list of tokenIds owned by an address
```typescript
const receivedFilter = erc721.filters.Transfer(undefined, address);
const sentFilter = erc721.filters.Transfer(address);
const [received, sent] = await Promise.all([
  erc721.queryFilter(receivedFilter),
  erc721.queryFilter(sentFilter),
]);
const tokens = erc721Tokens(received, sent);
```

#### `erc1155Tokens(received: Event[], batchReceived: Event[], sent: Event[], batchSent: Event[]): Record<string, BigNumber>`
Returns the amounts of tokenIds owned by an address
```typescript
const [receivedSingle, receivedBatch, sentSingle, sentBatch] = await Promise.all([
  erc1155.queryFilter(erc1155.filters.TransferSingle(undefined, undefined, address)),
  erc1155.queryFilter(erc1155.filters.TransferBatch(undefined, undefined, address)),
  erc1155.queryFilter(erc1155.filters.TransferSingle(undefined, address)),
  erc1155.queryFilter(erc1155.filters.TransferBatch(undefined, address)),
]);
const tokensBalance = erc1155Tokens(receivedSingle, receivedBatch, sentSingle, sentBatch);
```

## Chain
Toolkit to manage Chains metadata based on https://github.com/ethereum-lists/chains repository.

#### `getChain(chainId: string|number): Promise<Chain>`
Return the metadata associated with the `chainId` in https://github.com/ethereum-lists/chains

#### `getChainIcons(name: string, format?: 'png' | 'jpg' | 'svg'): Promise<ChainIcon>`
Return the chain icon metadata based on the name provided by the chain metadata (see `getChain` above).

#### `defaultCustomChains`
Static values to add http://localhost:8545 & Hardhat local network as a supported Chain

## ERC1193
This is an abstract class to create custom ERC1193 classes.

### InjectedProviders
This is an implementation of the ERC1193 classes for web3 injected providers.

```typescript
const erc1193 = new InjectedProviders();
// Ask the user to connect a wallet (coinbase or Metamask)
const [address] = await erc1193.enable();

// Ask the user to switch to Mumbai, and set the chain if it doesn't exist yet
const mumbai = await getChain(80001);
await erc1193.addChain(mumbai);
await erc1193.switchChain(mumbai);
```