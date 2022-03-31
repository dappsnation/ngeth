import { Injectable } from "@angular/core";
import { FireCollection } from "ngfire";
import { JsonFragment } from "@ethersproject/abi";
import { getAddress } from "@ethersproject/address";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { DocumentSnapshot, QueryDocumentSnapshot, where } from "firebase/firestore";
import { ChainId, MetaMask, toChainIndex } from "@ngeth/ethers";
import { BigNumber } from "ethers";

interface DeployTransaction {
  hash: string;
  to: string | null;
  from: string;
  nonce: number;
  value: BigNumber;
  chainId: number;
}

interface DeployedContract {
  transaction: DeployTransaction;
  address: string;
  standard: 'erc20' | 'erc721' | 'erc1155';
  abi: JsonFragment[];
}


interface EthersContract {
  address?: string;
  transaction?: TransactionResponse;
  standard?: 'erc20' | 'erc721' | 'erc1155';
  abi?: JsonFragment[];
}

export function toContract(base: EthersContract): Partial<DeployedContract> {
  const result: Partial<DeployedContract> = { ...base } as any;
  if (base.transaction) result.transaction = toFirestoreTransaction(base.transaction);
  if (base.address) result.address = getAddress(base.address);
  return result;
}

// Remove field from ContractTransaction & TransactionResponse
function toFirestoreTransaction(base: TransactionResponse): DeployTransaction {
  return {
    hash: base.hash,
    nonce: base.nonce,
    from: getAddress(base.from),
    to: base.to ? getAddress(base.to) : null,
    chainId: toChainIndex(base.chainId),
    value: base.value.toString() as any,
  }
}

function fromFirestoreTransaction(base: any) {
  const tx = { ...base } as any;
  tx.value = BigNumber.from(base.value);
  return tx;
}

@Injectable({ providedIn: 'root' })
export class ContractCollection extends FireCollection<DeployedContract> {
  override readonly path = 'contracts';
  override readonly idKey = 'address';
  override memorize = true;

  fromAccount(account: string, chainId: ChainId) {
    return this.valueChanges([
      where('transaction.from', '==', account),
      where('transaction.chainId', '==', chainId),
    ]);
  }

  protected override fromFirestore(snapshot: DocumentSnapshot<DeployedContract> | QueryDocumentSnapshot<DeployedContract>): DeployedContract | undefined {
    const res = super.fromFirestore(snapshot);
    if (!res) return;
    res.transaction = fromFirestoreTransaction(res.transaction);
    return res;
  }
}