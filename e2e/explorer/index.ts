import { TransactionReceipt, Block, Log } from '@ethersproject/abstract-provider';
import { ABIDescription } from '@type/solc';

export interface EthAccount {
  isContract: boolean;
  address: string;
  balance: string;
  /** Hashes of the transactions done by the account */
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
  /** ABI per contract address */
  abis: Record<string, ABIDescription[]>
  /** Logs per addresses in "desc" order */
  logs: Record<string, Log[]>
}