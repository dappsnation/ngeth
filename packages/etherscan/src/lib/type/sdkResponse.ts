//////////////
// ACCOUNTS //
//////////////

import { ABIDescription } from "@type/solc";
import { BigNumber } from "ethers";

export interface balanceSDKresponse {
  balance: BigNumber;
}
export interface balanceMultiSDKresponse {
  account: string;
  balance: BigNumber;
}

export interface TxListSDKResponse {
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

export interface TxListInternalSDKResponse {
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

export interface TokenTxSDKResponse {
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
export interface TokenNftTxSDKResponse {
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

export interface Token1155TxSDKResponse {
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
export interface MinedBlockSDKResponse {
  blockNumber: number;
  timeStamp: Date;
  blockReward: BigNumber;
}

export interface BalanceHistorySDKResponse {
  balance: BigNumber;
}

///////////////
// CONTRACTS //
///////////////

export interface GetAbiSDKResponse {
  abi: ABIDescription[]
}
export interface GetSourceCodeSDKResponse {
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

export interface StatusSDKResponse {
  isError: boolean;
  errDescription: string;
}

export interface TxReceiptStatusSDKResponse {
  status: boolean;
}

////////////
// BLOCKS //
////////////

export interface BlockRewardSDKResponse {
  blockNumber: number;
  timeStamp: string;
  blockMiner: string;
  blockReward: BigNumber;
  uncles: UnclesSDKResponse[];
  uncleInclusionReward: number;
}
export interface UnclesSDKResponse {
  miner: string;
  unclePosition: number;
  blockreward: BigNumber;
}

export interface BlockCountdownSDKResponse {
  CurrentBlock: number;
  CountdownBlock: number;
  RemainingBlock: number;
  EstimateTimeInSec: number;
}

export interface BlocknoByTimeSDKResponse {
  blockNumber: number;
}

export interface DailyAvgBlockSizeSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  blockSize_bytes: number;
}
export interface dailyBlkCountSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  blockCount: number
  blockRewards_Eth: BigNumber;
}
export interface dailyBlockRewardsSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  blockRewards_Eth: BigNumber;
}
export interface dailyBlockTimeSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  blockTime_sec: BigNumber;
}
export interface dailyUncleBlkCountSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  uncleBlockCount: number;
  uncleBlockRewards_Eth: BigNumber;
}

//////////
// LOGS //
//////////

export interface LogsSDKResponse {
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

export interface BlockNumberSDKResponse {
  blockNumber: number;
}

export interface BlockByNumberSDKResponse {
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

export interface UncleByBlockNumberAndIndexSDKResponse {
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

export interface BlockTransactionCountByNumberSDKResponse {
  count: number;
}

export interface TransactionByHashSDKResponse {
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

export interface TransactionByBlockNumberAndIndexSDKResponse {
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

export interface RawTransactionSDKResponse {
  raw: string;
}

export interface TransactionReceiptSDKResponse {
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

export interface CallSDKResponse {
  call: string;
}
export interface CodeSDKResponse {
  code: string;
}
export interface StorageAtSDKResponse {
  storageAt: BigNumber;
}

export interface GasPriceSDKResponse {
  gasPrice: BigNumber;
}
export interface EstimateGasSDKResponse {
  estimatiteGas: BigNumber;
}

////////////
// TOKENS //
////////////

export interface TokenSupplySDKResponse {
  amount: BigNumber;
}

export interface TokenBalanceSDKResponse {
  balance: BigNumber;
}

export interface TokenSupplyHistorySDKResponse {
  amount: BigNumber;
}

export interface TokenBalanceHistorySDKResponse {
  balance: BigNumber;
}

export interface TokenInfoSDKResponse {
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

export interface GasTrackerSDKResponse {
  time: number;
}

export interface GasOracleSDKResponse {
  LastBlock: number;
  SafeGasPrice:BigNumber;
  ProposeGasPrice: BigNumber;
  FastGasPrice: BigNumber;
  suggestBaseFee: BigNumber;
  gasUsedRatio: BigNumber;
}

export interface DailyAvgGasLimitSDKResponse {
  UTCDate: Date;
  unixTimeStamp: string;
  gasLimit: BigNumber;
}

export interface DailyGasUsedSDKResponse {
  UTCDate: Date;
  unixTimeStamp: string;
  gasUsed: BigNumber;
}

export interface DailyAvgGasPriceSDKResponse {
  UTCDate: Date;
  unixTimeStamp: string;
  maxGasPrice_Wei: number;
  minGasPrice_Wei: number;
  avgGasPrice_Wei: number;
}


///////////
// STATS //
///////////

export interface EthSupplySDKResponse {
  supply: BigNumber;
}

export interface EthSupply2SDKResponse {
  EthSupply: BigNumber;
  Eth2Staking: BigNumber;
  BurntFees: BigNumber;
}

export interface EthPriceSDKResponse {
  ethbtc: number;
  ethbtc_timestamp: number;
  ethusd: number;
  ethusd_timestamp: number
}

export interface EthNodesSizeSDKResponse {
  blockNumber: number;
  chainTimeStamp: Date;
  chainSize: number;
  clientType: string;
  syncMode: string;
}

export interface NodeCountSDKResponse {
  UTCDate: Date;
  TotalNodeCount: number;
}

export interface DailyTxFeesSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  transactionFee_Eth: BigNumber;
}
export interface DailyNewAddressCountSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  newAddressCount: number;
}
export interface DailyNetworkUtilisationSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  networkUtilization: number;
}
export interface DailyAvgNetworkHahSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  networkHashRate: number;
}
export interface DailyTxCountSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  transactionCount: number;
}
export interface DailyAvgNetworkDifficultySDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  networkDifficulty: number;
}
export interface EthDailyMarketCapSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  supply: BigNumber;
  marketCap: number;
  price: BigNumber;
}
export interface EthDailyHistoricalPriceSDKResponse {
  UTCDate: Date;
  unixTimeStamp: number;
  value: BigNumber;
}