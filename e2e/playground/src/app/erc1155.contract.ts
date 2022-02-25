import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { BaseERC1155, BaseERC1155Events } from '@contracts/BaseERC1155';
import { EventArgs } from "@contracts/common";
import { constants } from "ethers";
import { combineLatest, map } from "rxjs";

export const OPERATOR_ADDRESS = new InjectionToken('Address of the operator if any');

type SingleTransfer = EventArgs<BaseERC1155Events, "TransferSingle">;
type BatchTransfer = EventArgs<BaseERC1155Events, "TransferBatch">;

function getAllIds([singleTransfers, batchTransfers]: [SingleTransfer[], BatchTransfer[]]) {
  const batchedIds = batchTransfers.map(event => event.ids).flat();
  const ids = singleTransfers.map(event => event.id).concat(batchedIds);
  return Array.from(new Set(ids));
}

@Injectable({ providedIn: 'root' })
export class ERC1155 extends BaseERC1155 {

  constructor(
    @Optional() @Inject(OPERATOR_ADDRESS) private operator?: string,
  ) {
    super();
  }

  idsFromTransfers(from: null | string, to?: string, operator: string | undefined = this.operator) {
    const singleFilter = this.filters.TransferSingle(operator, from, to);
    const batchFilter = this.filters.TransferBatch(operator, from, to);
    return combineLatest([
      this.from(singleFilter),
      this.from(batchFilter),
    ]).pipe(
      map(getAllIds)
    )
  }

  /** Get the tokens & balance of an account */
  async getTokensFrom(account: string, operator: string | undefined = this.operator) {
    // 1. Get unique ids
    const ids = await this.getTransferIds(operator, account);
    // 2. Get balance for each id
    const getBalances = ids.map(id => this.balanceOf(account, id).then(amount => ({ id, amount })));
    const balances = await Promise.all(getBalances);
    // 3. Format & filter
    return balances
      .map(value => ({ id: value.id.toNumber(), amount: value.amount.toNumber() }))
      .filter(value => value.amount);
  }

  /** Get all the tokenIds of the of contract */
  async getAllTokenIds(operator: string | undefined = this.operator) {
    return this.getTransferIds(operator, constants.AddressZero);
  }

  private async getTransferIds(operator: string | undefined, from: null | string, to?: string) {
    // 1. Create filters
    const singleFilter = this.filters.TransferSingle(operator, from, to);
    const batchFilter = this.filters.TransferBatch(operator, from, to);
    // 2. Get the ids
    const allTransfers = await Promise.all([
      this.queryFilter(singleFilter).then(events => events.map(event => event.args)),
      this.queryFilter(batchFilter).then(events => events.map(event => event.args))
    ]);
    return getAllIds(allTransfers);
  }
}