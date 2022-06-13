import { TransactionReceipt, TransactionResponse, Block, Log } from '@ethersproject/abstract-provider';
import { ABIDescription } from '@type/solc';

export interface EthStore {
  /** block indexed by block height */
  blocks: Block[];
  /** Transaction response indexed by Transaction hash */
  transactions: Record<string, TransactionResponse>;
  /** Transaction receipt indexed by Transaction hash */
  receipts: Record<string, TransactionReceipt>;
  /** History of transaction indexed by addresses */
  addresses: Record<string, EthAccount>;
  /** State of the network indexed by block height */
  states: EthState[];
  /** Logs indexed by addresses */
  logs: Record<string, Log[]>;
  /** List of external account addresses (not contract) */
  accounts: string[],
  /** List of contract addresses */
  contracts: string[],
  /** Artifacts */
  artifacts: Record<string, ContractArtifact>
}


export interface EthAccount {
  isContract: boolean;
  address: string;
  balance: string;
  /** Hashes of the transactions done by the account */
  transactions: string[];
}


export interface ContractArtifact {
  contractName: string;
  sourceName: string;
  abi: ABIDescription[];
  standard?: 'ERC20' | 'ERC721' | 'ERC1155';
  deployedBytecode: string; // "0x"-prefixed hex string
}


export interface ContractAccount extends EthAccount{
  isContract: true;
  /** Key of the artifact in the artifact record */
  artifact: string;
}

export interface EthState {
  balances: Record<string, string>;
}

export const isContract = (account: EthAccount): account is ContractAccount => {
  return account.isContract;
}