import { TransactionReceipt, TransactionResponse, Block, Log } from '@ethersproject/abstract-provider';
import { ABIDescription } from '@type/solc';
import { BigNumber } from '@ethersproject/bignumber';
import { BuildInfo } from 'hardhat/types';

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
  /** Build Info */
  buildInfos: BuildInfo[]
  /** Builds: TO REMOVE FOR BuildInfo */
  builds: Record<string, EtherscanSourceCode>
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

export interface EtherscanSourceCode {
  sourceCode: string;
  abi: ABIDescription[];
  contractName: string;
  compilerVersion: string;
  optimizationUsed: string;
  runs: string;
}

export interface ContractAccount extends EthAccount{
  isContract: true;
  /** Key of the artifact in the artifact record */
  artifact: string;
  metadata?: unknown;
}
export interface ERC20Account extends ContractAccount {
  metadata: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: BigNumber;
  }
}
export interface ERC721Account extends ContractAccount {
  metadata: {
    name: string;
    decimals: number;
    symbol: string;
  }
}

export interface ERC1155Account extends ContractAccount {
  metadata: {
    name: string;    
    symbol: string;
  }
}

export interface EthState {
  balances: Record<string, BigNumber>;
  erc20: {
    [owner: string]: {
      [tokenAddres: string]: BigNumber
    }
  }
  erc721: {
    [owner: string]: {
      [tokenAddres: string]: number[]
    }
  }
  erc1155: {
    [owner: string]: {
      [tokenAddres: string]: {
        [tokenId: string]: BigNumber
      }
    }
  }
}

export const isContract = (account: EthAccount): account is ContractAccount => {
  return account.isContract;
}