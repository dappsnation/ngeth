# etherscan

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build etherscan` to build the library.

## Running unit tests

Run `nx test etherscan` to execute the unit tests via [Jest](https://jestjs.io).

## implemented functions

### Accounts

- [x] balance
- [x] balancemulti
- [x] txlist
- [x] txlistinternal (by address)
- [x] txlistinternal (by txHash)
- [x] txlistinternal (by block range)
- [x] tokentx
- [x] tokennfttx
- [x] token1155tx
- [x] getminedblocks
- [x] balancehistory

### Contracts

- [x] getabi
- [x] getsourcecode
- [] verifyproxycontract : not implement, method POST
- [] verifysourcecode : not implement, method POST
- [] checkproxyverification : not implement, method POST
- [] checkverifystatus

### Transactions

- [x] getstatus
- [x] gettxreceiptstatus

### Blocks

- [x] getblockreward
- [x] getblockcountdown
- [x] getblocknobytime
- [x] dailyavgblocksize
- [x] dailyblkcount
- [x] dailyblockrewards
- [x] dailyavgblocktime
- [x] dailyuncleblkcount

### Logs

- [x] getLogs (by Address)
- [x] getLogs (by Topics)
- [x] getLogs (by Address filtered by Topics)

### Geth/Parity Proxy

- [x] eth_blockNumber
- [x] eth_getBlockByNumber
- [x] eth_getUncleByBlockNumberAndIndex
- [x] eth_getBlockTransactionCountByNumber
- [x] eth_getTransactionByHash
- [x] eth_getTransactionByBlockNumberAndIndex
- [x] eth_getTransactionCount
- [x] eth_sendRawTransaction
- [x] eth_getTransactionReceipt
- [x] eth_call
- [x] eth_getCode
- [ ] eth_getStorageAt: no implement because this endpoint is still experimental
- [x] eth_gasPrice
- [x] eth_estimateGas

### Tokens

- [x] tokensupply
- [x] tokenbalance
- [x] tokensupplyhistory
- [x] tokenbalancehistory
- [x] tokeninfo
- [] addresstokennftinventory : no visible response on docs.etherscan.io

### Gas Tracker

- [x] gasestimate
- [x] gasoracle
- [x] dailyavggaslimit
- [x] dailygasused
- [x] dailyavggasprice

### Stats

- [x] ethsupply
- [x] ethsupply2
- [x] ethprice
- [x] chainsize
- [x] nodecount
- [x] dailytxnfee
- [x] dailynewaddress
- [x] dailynetutilization
- [x] dailyavghashrate
- [x] dailytx
- [x] dailyavgnetdifficulty
- [x] ethdailymarketcap
- [x] ethdailyprice
