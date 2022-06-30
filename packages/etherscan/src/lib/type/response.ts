import { ABIDescription } from '@type/solc';

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
  confirmation: string
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

// Result
export interface ExecutionStatusResult {
  /** 0: Succeed, 1: Failed */
  isError: 0 | 1;
  errDescription?: string;
}
export interface StatusResult {
  /** 0: Succeed, 1: Failed */
  status: 0 | 1;
}