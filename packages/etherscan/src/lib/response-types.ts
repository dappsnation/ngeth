import { ABIDescription } from '@type/solc';


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