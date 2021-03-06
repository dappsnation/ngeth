import { ExecutionStatusResult, GetParams, GetStatusRequest, GetTxReceiptStatusRequest, StatusResult } from "@ngeth/etherscan";
import { store } from '../store';

export function getStatus({ txhash }: GetParams<GetStatusRequest>): ExecutionStatusResult {
  if (!store.receipts[txhash]) return { isError: "1", errDescription: 'Transaction not found' };
  const isError = store.receipts[txhash].status;
  if (isError === 0) return { isError: "0" };
  return {
    isError: "1",
    errDescription: '' // TODO
  };
}

export function getTxReceiptStatus({ txhash }: GetParams<GetTxReceiptStatusRequest>): StatusResult | undefined {
  if (!store.receipts[txhash]) return;
  const status = store.receipts[txhash].status.toString() as "0" | "1";
  return { status };
}

