import { ExecutionStatusResult, GetParams, GetStatus, GetTxReceiptStatus, StatusResult } from "@ngeth/etherscan";
import { store } from '../store';

export function getStatus({ txhash }: GetParams<GetStatus>): ExecutionStatusResult {
  if (!store.receipts[txhash]) return { isError: 1, errDescription: 'Transaction not found' };
  const isError = store.receipts[txhash].status;
  if (isError === 0) return { isError: 0 };
  return {
    isError: 1,
    errDescription: '' //TODO
  };
}

export function getTxReceiptStatus({ txhash }: GetParams<GetTxReceiptStatus>): StatusResult | undefined {
  if (!store.receipts[txhash]) return;
  const status = store.receipts[txhash].status as 0 | 1;
  return { status };
}

