import { ExecutionStatusResult, GetParams, GetStatus, GetTxReceiptStatus, StatusResult } from "./types";
import { transactions } from '../block';

export function getStatus({ txhash }: GetParams<GetStatus>): ExecutionStatusResult {
  if (!transactions[txhash]) return { isError: 1, errDescription: 'Transaction not found' };
  const isError = transactions[txhash].status;
  if (isError === 0) return { isError: 0 };
  return {
    isError: 1,
    errDescription: '' // TODO
  };
}

export function getTxReceiptStatus({ txhash }: GetParams<GetTxReceiptStatus>): StatusResult | undefined {
  if (!transactions[txhash]) return;
  const status = transactions[txhash].status as 0 | 1;
  return { status };
}

