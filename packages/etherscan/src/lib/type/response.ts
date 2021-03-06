import { TransactionResponse, Log } from "@ethersproject/abstract-provider";

export interface TransferTransactionResponse {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  confirmation: string;
}
export interface ERC20TxResponse extends TransferTransactionResponse {
  tokenSymbol:string;
  tokenName: string;
  tokenDecimal: string;
}
export interface ERC721TxResponse extends TransferTransactionResponse {
  tokenId: string;
  tokenSymbol:string;
  tokenName: string;
  tokenDecimal: string;
}
export interface ERC1155TxResponse extends TransferTransactionResponse {
  tokenId: string;
  tokenSymbol:string;
  tokenName: string;
  tokenValue: string;
}

export interface TxListResponse {
  blockNumber: string,
  timeStamp: string,
  hash: string,
  nonce: string,
  blockHash: string,
  transactionIndex: string,
  from: string,
  to: string,
  value: string,
  gas:string,
  gasPrice: string,
  isError: string,
  txreceipt_status: string,
  contractAddress: string,
  cumulativesGasUsed: string,
  gasUsed: string,
  confirmation: string,
}

export interface TxListInternalResponse {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  traceId: string;
  isError: string;
  errCode: string;
}

export interface TokenTxResponse {
  blockNumber: string,
  timeStamp: string,
  hash: string,
  nonce: string,
  blockHash: string,
  from: string,
  contractAddress: string,
  to: string,
  value: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimal: string,
  transactionIndex: string,
  gas: string,
  gasPrice: string,
  gasUsed: string,
  cumulativeGasUsed: string,
  confirmations: string,
}
export interface TokenNftTxResponse {
  blockNumber: string,
  timeStamp: string,
  hash: string,
  nonce: string,
  blockHash: string,
  from: string,
  contractAddress: string,
  to: string,
  tokenID: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimal: string,
  transactionIndex: string,
  gas: string,
  gasPrice: string,
  gasUsed: string,
  cumulativeGasUsed: string,
  confirmations: string,
}
export interface Token1155TxResponse {
  blockNumber: string,
  timeStamp: string,
  hash: string,
  nonce: string,
  blockHash: string,
  transactionIndex: string,
  gas: string,
  gasPrice: string,
  gasUsed: string,
  cumulativeGasUsed: string,
  contractAddress: string,
  from: string,
  to: string,
  tokenID: string,
  tokenValue: string,
  tokenName: string,
  tokenSymbol: string,
  confirmations: string
}

export interface TokenInfoResponse {
  contractAddress: string,
  tokenName: string,
  symbol: string,
  divisor: string,
  tokenType: string,
  totalSupply: string,
  blueCheckmark: string,
  description: string,
  website: string,
  email: string,
  blog: string,
  reddit: string,
  slack: string,
  facebook: string,
  twitter: string,
  bitcointalk: string,
  github: string,
  telegram: string,
  wechat: string,
  linkedin: string,
  discord: string,
  whitepaper: string,
  tokenPriceUSD: string,
};

export interface BalanceMultiResponse {
  account: string;
  balance: string;
}

export interface MinedBlockResponse {
  blockNumber: string;
  timeStamp: string;
  blockReward: string;
}

export interface ContractSourceCodeResponse {
  SourceCode: string;
  ABI: string;
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

// Result
export interface ExecutionStatusResult {
  /** 0: Succeed, 1: Failed */
  isError: "0" | "1";
  errDescription?: string;
}
export interface StatusResult {
  /** 0: Succeed, 1: Failed */
  status: "0" | "1";
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

export interface BlockRewardResponse {
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

export interface BlockCountdownResponse {
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

export interface BlockResponse<T extends Transaction> {
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
  uncles: string[];
}

export interface UncleBlockResponse {
  baseFeePerGas: string;
  difficulty: string;
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
  transactionsRoot: string;
  uncles: string[];
}

export interface TransactionInfosResponse {
  blockHash: string;
  blockNumber: string;
  from: string;
  gas: string;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  hash: string;
  input: string;
  nonce: string;
  to: string;
  transactionIndex: string;
  value: string;
  type: string;
  accessList: string[];
  chainId: string;
  v: string;
  r: string;
  s: string;
}

export interface TxByBlockNumberAndIndexResponse {
    accessList: string[];
    blockHash: string;
    blockNumber: string;
    chainId: string;
    condition: string;
    creates: string;
    from: string;
    gas: string;
    gasPrice: string;
    hash: string;
    input: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    nonce: string;
    publicKey: string;
    r: string;
    raw: string;
    s: string;
    to: string;
    transactionIndex: string;
    type: string;
    v: string;
    value: string;
}

export interface TxReceiptResponse {
  blockHash: string;
  blockNumber: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  from: string;
  gasUsed: string;
  logs: Log[];
  logsBloom: string;
  status:string;
  to: string;
  transactionHash: string;
  transactionIndex: string;
  type: string;
}

/////////////////
// GAS TRACKER //
/////////////////

export interface GasOracleResponse {
  LastBlock: string;
  SafeGasPrice:string;
  ProposeGasPrice: string;
  FastGasPrice: string;
  suggestBaseFee: string;
  gasUsedRatio: string;
}

export interface DailyAvgGasLimitResponse {
  UTCDate: string;
  unixTimeStamp: string;
  gasLimit: string;
}
export interface DailyGasUsedResponse {
  UTCDate: string;
  unixTimeStamp: string;
  gasUsed: string;
}

export interface DailyAvgGasPriceResponse {
  UTCDate: string;
  unixTimeStamp: string;
  maxGasPrice_Wei: string;
  minGasPrice_Wei: string;
  avgGasPrice_Wei: string;
}

///////////
// STATS //
///////////

export interface EthSupply2Response {
  EthSupply: string;
  Eth2Staking: string;
  BurntFees: string;
}

export interface EthPriceResponse {
  ethbtc: string;
  ethbtc_timestamp: string;
  ethusd: string;
  ethusd_timestamp: string
}

export interface EthNodesSizeResponse {
  blockNumber: string;
  chainTimeStamp: string;
  chainSize: string;
  clientType: string;
  syncMode: string;
}

export interface NodeCountResponse {
  UTCDate: string;
  TotalNodeCount: string;
}

export interface DailyTxFeesResponse {
  UTCDate: string;
  unixTimeStamp: string;
  transactionFee_Eth: string;
}
export interface DailyNewAddressCountResponse {
  UTCDate: string;
  unixTimeStamp: string;
  newAddressCount: string;
}
export interface DailyNetworkUtilisationResponse {
  UTCDate: string;
  unixTimeStamp: string;
  networkUtilization: string;
}
export interface DailyAvgNetworkHahResponse {
  UTCDate: string;
  unixTimeStamp: string;
  networkHashRate: string;
}
export interface DailyTxCountResponse {
  UTCDate: string;
  unixTimeStamp: string;
  transactionCount: string;
}
export interface DailyAvgNetworkDifficultyResponse {
  UTCDate: string;
  unixTimeStamp: string;
  networkDifficulty: string;
}
export interface EthDailyMarketCapResponse {
  UTCDate: string;
  unixTimeStamp: string;
  supply: string;
  marketCap: string;
  price: string;
}
export interface EthDailyHistoricalPriceResponse {
  UTCDate: string;
  unixTimeStamp: string;
  value: string;
}