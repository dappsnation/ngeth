import { TransactionReceipt, Block } from '@ethersproject/abstract-provider';

export interface EthAccount {
  isContract: boolean;
  address: string;
  balance: string;
  transactions: string[];
}

export interface EthState {
  balances: Record<string, string>;
}

export interface BlockchainState {
  /** All the blocks */
  blocks: Block[];
  /** All transactions recorded by their hash */
  transactions: Record<string, TransactionReceipt>;
  /** History of transaction per addresses */
  addresses: Record<string, EthAccount>;
  /** State of the network at a specific block */
  states: EthState[];
}