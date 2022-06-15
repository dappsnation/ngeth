import { ABIDescription } from '@type/solc';
import { TransactionResponse } from "@ethersproject/abstract-provider";


export interface BalanceMultiResponse {
  account: string;
  balance: string;
}

export interface MinedBlockResponse {
  blockNumber: string;
  timeStamp: string;
  blockReward: string;
}

export interface ContractSourceCode {
  SourceCode: string;
  ABI: ABIDescription[];
  ContractName: string;
  CompilerVersion: string;
  OptimizationUsed: string;
  Runs: string;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
}

export interface DailyAvgBlocksizeResponse {
  UTCDate: string;
  unixTimeStamp: string;
  blockSize_bytes: string;
}

export interface DailyBlockCountAndRewardResponse {
  UTCDate: string;
  unixTimeStamp: string;
  blockCount: string;
  blockRewards_Eth: string;
}

export interface DailyBlockRewardResponse {
  UTCDate: string;
  unixTimeStamp: string;
  blockRewards_Eth: string;
}

export interface DailyBlockTimeResponse {
  UTCDate: string;
  unixTimeStamp: string;
  blockTime_sec: string;
}

export interface DailyUncleBlockCountReponse {
  UTCDate: string;
  unixTimeStamp: string;
  uncleBlockCount: string;
  uncleBlockRewards_Eth: string;
}

export interface BlockReward {
  blockNumber: string;
  timeStamp: string;
  blockMiner: string;
  blockReward: string;
  uncles: Uncles[];
  uncleInclusionReward: string;
}

export interface Uncles {
  miner: string;
  unclePosition: string;
  blockreward: string;
}

export interface BlockCountdown {
  CurrentBlock: string;
  CountdownBlock: string;
  RemainingBlock: string;
  EstimateTimeInSec: string;
}

export interface LogsResponse {
  address: string;
  topics: string[];
  data: string;
  blockNumber: string;
  timeStamp: string;
  gasPrice: string;
  gasUsed: string;
  logIndex: string;
  transactionHash: string;
  transactionIndex: string;
}

type Transaction = string[] | TransactionResponse[];

export interface Block<T extends Transaction> {
  difficulty: string;
  baseFeePerGas: string;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: string;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: string;
  stateRoot: string;
  timestamp: string;
  totalDifficulty: string;
  transactions: T;
  transactionsRoot: string;
  uncles: string | [];
}