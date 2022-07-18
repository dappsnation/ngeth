//////////////
// ACCOUNTS //
//////////////

import { ABIDescription } from "@type/solc";
import { BigNumber } from "ethers";

export interface balance {
  balance: BigNumber;
}
export interface balanceMulti {
  account: string;
  balance: BigNumber;
}

export interface TxList {
  blockNumber: number,
  timeStamp: Date,
  hash: string,
  nonce: number,
  blockHash: string,
  transactionIndex: number,
  from: string,
  to: string,
  value: BigNumber,
  gas:BigNumber,
  gasPrice: BigNumber,
  isError: boolean,
  txreceipt_status: boolean,
  contractAddress: string,
  cumulativesGasUsed: BigNumber,
  gasUsed: BigNumber,
  confirmation: number,
}

export interface TxListInternal {
  blockNumber: number;
  timeStamp: Date;
  hash: string;
  from: string;
  to: string;
  value: BigNumber;
  contractAddress: string;
  input: string;
  type: string;
  gas: BigNumber;
  gasUsed: BigNumber;
  traceId: number;
  isError: boolean;
  errCode: string;
}

export interface TokenTx {
  blockNumber: number,
  timeStamp: Date,
  hash: string,
  nonce: number,
  blockHash: string,
  from: string,
  contractAddress: string,
  to: string,
  value: BigNumber,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimal: number,
  transactionIndex: number,
  gas: BigNumber,
  gasPrice: BigNumber,
  gasUsed: BigNumber,
  cumulativeGasUsed: BigNumber,
  confirmations: number,
}
export interface TokenNftTx {
  blockNumber: number,
  timeStamp: Date,
  hash: string,
  nonce: number,
  blockHash: string,
  from: string,
  contractAddress: string,
  to: string,
  tokenID: number,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimal: number,
  transactionIndex: number,
  gas: BigNumber,
  gasPrice: BigNumber,
  gasUsed: BigNumber,
  cumulativeGasUsed: BigNumber,
  confirmations: number,
}

export interface Token1155Tx {
  blockNumber: number,
  timeStamp: Date,
  hash: string,
  nonce: number,
  blockHash: string,
  transactionIndex: number,
  gas: BigNumber,
  gasPrice: BigNumber,
  gasUsed: BigNumber,
  cumulativeGasUsed: BigNumber,
  contractAddress: string,
  from: string,
  to: string,
  tokenID: number,
  tokenValue: number,
  tokenName: string,
  tokenSymbol: string,
  confirmations: number
}
export interface MinedBlock {
  blockNumber: number;
  timeStamp: Date;
  blockReward: BigNumber;
}

export interface BalanceHistory {
  balance: BigNumber;
}

///////////////
// CONTRACTS //
///////////////

export interface GetAbi {
  abi: ABIDescription[]
}
export interface GetSourceCode {
  SourceCode: string;
  ABI: ABIDescription[];
  ContractName: string;
  CompilerVersion: string;
  OptimizationUsed: number;
  Runs: number;
  ConstructorArguments: number;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
}

export interface CheckVerifyStatus {
  status: string;
}

//////////////////
// TRANSACTIONS //
//////////////////

export interface Status {
  isError: boolean;
  errDescription: string;
}

export interface TxReceiptStatus {
  status: boolean;
}

////////////
// BLOCKS //
////////////

export interface BlockReward {
  blockNumber: number;
  timeStamp: string;
  blockMiner: string;
  blockReward: BigNumber;
  uncles: Uncles[];
  uncleInclusionReward: number;
}
export interface Uncles {
  miner: string;
  unclePosition: number;
  blockreward: BigNumber;
}

export interface BlockCountdown {
  CurrentBlock: number;
  CountdownBlock: number;
  RemainingBlock: number;
  EstimateTimeInSec: number;
}

export interface BlocknoByTime {
  blockNumber: number;
}

export interface DailyAvgBlockSize {
  UTCDate: Date;
  unixTimeStamp: number;
  blockSize_bytes: number;
}
export interface dailyBlkCount {
  UTCDate: Date;
  unixTimeStamp: number;
  blockCount: number
  blockRewards_Eth: BigNumber;
}
export interface dailyBlockRewards {
  UTCDate: Date;
  unixTimeStamp: number;
  blockRewards_Eth: BigNumber;
}
export interface dailyBlockTime {
  UTCDate: Date;
  unixTimeStamp: number;
  blockTime_sec: BigNumber;
}
export interface dailyUncleBlkCount {
  UTCDate: Date;
  unixTimeStamp: number;
  uncleBlockCount: number;
  uncleBlockRewards_Eth: BigNumber;
}

//////////
// LOGS //
//////////

export interface Logs {
  address: string;
  topics: string[];
  data: string;
  blockNumber: number;
  timeStamp: Date;
  gasPrice: BigNumber;
  gasUsed: BigNumber;
  logIndex: number;
  transactionHash: string;
  transactionIndex: number;
}

///////////
// PROXY //
///////////

export interface BlockNumber {
  blockNumber: number;
}

export interface BlockByNumber {
  difficulty: number;
  baseFeePerGas: BigNumber;
  extraData: string;
  gasLimit: BigNumber;
  gasUsed: BigNumber;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: number;
  number: number;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: number;
  stateRoot: string;
  timestamp: Date;
  totalDifficulty: number;
  transactions: string[];
  transactionsRoot: string;
  uncles: string[];
}

export interface UncleByBlockNumberAndIndex {
  baseFeePerGas: BigNumber;
  difficulty: number;
  extraData: string;
  gasLimit: BigNumber;
  gasUsed: BigNumber;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: number;
  number: number;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: number;
  stateRoot: string;
  timestamp: Date;
  transactionsRoot: string;
  uncles: string[];
}

export interface BlockTransactionCountByNumber {
  count: number;
}

export interface TransactionByHash {
  blockHash: string;
  blockNumber: number;
  from: string;
  gas: BigNumber;
  gasPrice: BigNumber;
  maxFeePerGas: BigNumber;
  maxPriorityFeePerGas: BigNumber;
  hash: string;
  input: string;
  nonce: number;
  to: string;
  transactionIndex: number;
  value: BigNumber;
  type: number;
  accessList: string[];
  chainId: number;
  v: string;
  r: string;
  s: string;
}

export interface TransactionByBlockNumberAndIndex {
  accessList: string[];
  blockHash: string;
  blockNumber: number;
  chainId: number;
  condition: string;
  creates: string;
  from: string;
  gas: BigNumber;
  gasPrice: BigNumber;
  hash: string;
  input: string;
  maxFeePerGas: BigNumber;
  maxPriorityFeePerGas: BigNumber;
  nonce: number;
  publicKey: string;
  r: string;
  raw: string;
  s: string;
  to: string;
  transactionIndex: number;
  type: number;
  v: string;
  value: BigNumber;
}

export interface TransactionCountSDKRsponse {
  txCount: number;
}

export interface RawTransaction {
  raw: string;
}

export interface TransactionReceipt {
  blockHash: string;
  blockNumber: number;
  contractAddress: string;
  cumulativeGasUsed: BigNumber;
  effectiveGasPrice: BigNumber;
  from: string;
  gasUsed: BigNumber;
  logs: string[];
  logsBloom: string;
  status:number;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: number;
}

export interface Call {
  call: string;
}
export interface Code {
  code: string;
}
export interface StorageAt {
  storageAt: BigNumber;
}

export interface GasPrice {
  gasPrice: BigNumber;
}
export interface EstimateGas {
  estimatiteGas: BigNumber;
}

////////////
// TOKENS //
////////////

export interface TokenSupply {
  amount: BigNumber;
}

export interface TokenBalance {
  balance: BigNumber;
}

export interface TokenSupplyHistory {
  amount: BigNumber;
}

export interface TokenBalanceHistory {
  balance: BigNumber;
}

export interface TokenInfo {
  contractAddress: string;
  tokenName: string;
  symbol: string;
  divisor: number;
  tokenType: string;
  totalSupply: BigNumber;
  blueCheckmark: string;
  description: string;
  website: string;
  email: string;
  blog: string;
  reddit: string;
  slack: string;
  facebook: string;
  twitter: string;
  bitcointalk: string;
  github: string;
  telegram: string;
  wechat: string;
  linkedin: string;
  discord: string;
  whitepaper: string;
  tokenPriceUSD: string;
}

/////////////////
// GAS TRACKER //
/////////////////

export interface GasTracker {
  time: number;
}

export interface GasOracle {
  LastBlock: number;
  SafeGasPrice:BigNumber;
  ProposeGasPrice: BigNumber;
  FastGasPrice: BigNumber;
  suggestBaseFee: BigNumber;
  gasUsedRatio: BigNumber;
}

export interface DailyAvgGasLimit {
  UTCDate: Date;
  unixTimeStamp: string;
  gasLimit: BigNumber;
}

export interface DailyGasUsed {
  UTCDate: Date;
  unixTimeStamp: string;
  gasUsed: BigNumber;
}

export interface DailyAvgGasPrice {
  UTCDate: Date;
  unixTimeStamp: string;
  maxGasPrice_Wei: number;
  minGasPrice_Wei: number;
  avgGasPrice_Wei: number;
}


///////////
// STATS //
///////////

export interface EthSupply {
  supply: BigNumber;
}

export interface EthSupply2 {
  EthSupply: BigNumber;
  Eth2Staking: BigNumber;
  BurntFees: BigNumber;
}

export interface EthPrice {
  ethbtc: number;
  ethbtc_timestamp: number;
  ethusd: number;
  ethusd_timestamp: number
}

export interface EthNodesSize {
  blockNumber: number;
  chainTimeStamp: Date;
  chainSize: number;
  clientType: string;
  syncMode: string;
}

export interface NodeCount {
  UTCDate: Date;
  TotalNodeCount: number;
}

export interface DailyTxFees {
  UTCDate: Date;
  unixTimeStamp: number;
  transactionFee_Eth: BigNumber;
}
export interface DailyNewAddressCount {
  UTCDate: Date;
  unixTimeStamp: number;
  newAddressCount: number;
}
export interface DailyNetworkUtilisation {
  UTCDate: Date;
  unixTimeStamp: number;
  networkUtilization: number;
}
export interface DailyAvgNetworkHah {
  UTCDate: Date;
  unixTimeStamp: number;
  networkHashRate: number;
}
export interface DailyTxCount {
  UTCDate: Date;
  unixTimeStamp: number;
  transactionCount: number;
}
export interface DailyAvgNetworkDifficulty {
  UTCDate: Date;
  unixTimeStamp: number;
  networkDifficulty: number;
}
export interface EthDailyMarketCap {
  UTCDate: Date;
  unixTimeStamp: number;
  supply: BigNumber;
  marketCap: number;
  price: BigNumber;
}
export interface EthDailyHistoricalPrice {
  UTCDate: Date;
  unixTimeStamp: number;
  value: BigNumber;
}