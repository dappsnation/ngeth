import { BigNumber, BigNumberish } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { FilterParam, NgContract, TypedFilter } from "./contract";

export interface ERC1155Events {
  events: {
    ApprovalForAll: (account: string, operator: string, approved: boolean) => void;
    OwnershipTransferred: (previousOwner: string, newOwner: string) => void;
    TransferBatch: (operator: string, from: string, to: string, ids: BigNumberish[], values: BigNumberish[]) => void;
    TransferSingle: (operator: string, from: string, to: string, id: BigNumberish, value: BigNumberish) => void;
    URI: (value: string, id: BigNumberish) => void;
  };
  filters: {
    ApprovalForAll: (account?: FilterParam<string>, operator?: FilterParam<string>) => TypedFilter<"ApprovalForAll">;
    OwnershipTransferred: (
      previousOwner?: FilterParam<string>,
      newOwner?: FilterParam<string>
    ) => TypedFilter<"OwnershipTransferred">;
    TransferBatch: (
      operator?: FilterParam<string>,
      from?: FilterParam<string>,
      to?: FilterParam<string>
    ) => TypedFilter<"TransferBatch">;
    TransferSingle: (
      operator?: FilterParam<string>,
      from?: FilterParam<string>,
      to?: FilterParam<string>
    ) => TypedFilter<"TransferSingle">;
    URI: (id?: FilterParam<BigNumberish>) => TypedFilter<"URI">;
  };
  queries: {
    ApprovalForAll: { account: string; operator: string; approved: boolean };
    OwnershipTransferred: { previousOwner: string; newOwner: string };
    TransferBatch: { operator: string; from: string; to: string; ids: BigNumber[]; values: BigNumber[] };
    TransferSingle: { operator: string; from: string; to: string; id: BigNumber; value: BigNumber };
    URI: { value: string; id: BigNumber };
  };
}




export async function getTokens(this: NgContract<ERC1155Events>, address: string) {
  const account = getAddress(address);
  // Single transfer (received & sent)
  const receivedSingle = this.filters.TransferSingle(null, null, account);
  const sentSingle = this.filters.TransferSingle(null, account);

  // Batch transfer (received & sent)
  const filterBatchReceived = this.filters.TransferBatch(null, null, address);
  const filterBatchSend = this.filters.TransferBatch(null, address);

  const [received, batchReceived, sent, batchSent ] = await Promise.all([
    this.queryFilter(receivedSingle),
    this.queryFilter(filterBatchReceived),
    this.queryFilter(sentSingle),
    this.queryFilter(filterBatchSend),
  ]);

  const tokens: Record<string, number> = {};

  for(const event of received) { 
    const [operator, from, to, tokenId, amount] = event.args;     
    const id = (tokenId as BigNumber).toString();
    if (!tokens[id]) tokens[id] = 0;
    tokens[id] += (amount as BigNumber).toNumber();
  }

  for (const event of batchReceived) {
    const [operator, from, to, tokenIds, amounts] = event.args;
    for (let i =0; i< tokenIds.length; i++) {
      const id = (tokenIds[i] as BigNumber).toString();
      if(!tokens[id]) tokens[id] = 0;
      tokens[id] += (amounts[i] as BigNumber).toNumber()
    }
  }

  for(const event of sent) {
    const [operator, from, to, tokenId, amount] = event.args;
    const id = (tokenId as BigNumber).toString();
    tokens[id] -= (amount as BigNumber).toNumber();
    if (tokens[id] <= 0) delete tokens[id];
  }

  for(const event of batchSent) {
    const [operator, from, to, tokensId, amounts] = event.args;
    for (let i=0; i< tokensId.length; i++) {
      const id = (tokensId[i] as BigNumber).toString();
      tokens[id] -= (amounts[i] as BigNumber).toNumber();
      if (tokens[id] <= 0) delete tokens[id];
    }
  }

  return tokens;
}