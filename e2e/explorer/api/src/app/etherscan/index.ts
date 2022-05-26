export { EtherscanParams } from './types';
import { EtherscanParams, AccountsParams, ContractParams, TransactionParams } from './types';
import { balance, balanceMulti } from './account';
import { getStatus, getTxReceiptStatus } from './transaction';

export function etherscanApi(params: EtherscanParams) {
  switch (params.module) {
    case 'account': return account(params);
    case 'contract': return contract(params);
    case 'transaction': return transaction(params);
  }
}

function account(params: AccountsParams) {
  switch (params.action) {
    case 'balance': return balance(params);
    case 'balancemulti': return balanceMulti(params);
    default: return {};
  }
}

function contract(params: ContractParams) {
  switch (params.action) {
    default: return {};
  }
}

function transaction(params: TransactionParams) {
  switch (params.action) {
    case 'getstatus': return getStatus(params);
    case 'gettxreceiptstatus': return getTxReceiptStatus(params);
    default: return {};
  }
}