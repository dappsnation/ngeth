export { EtherscanParams } from './types';
import { EtherscanParams, AccountsParams, ContractParams, TransactionParams, StatsParams } from './types';
import { balance, balanceMulti } from './account';
import { getStatus, getTxReceiptStatus } from './transaction';
import { tokenBalance, tokenSupply } from './tokens';

export function etherscanApi(params: EtherscanParams) {
  console.log('Module', params.module);
  switch (params.module) {
    case 'account': return account(params);
    case 'contract': return contract(params);
    case 'transaction': return transaction(params);
    case 'stats': return stats(params);
  }
}

function account(params: AccountsParams) {
  switch (params.action) {
    case 'balance': return balance(params);
    case 'balancemulti': return balanceMulti(params);
    case 'tokenbalance': return tokenBalance(params);
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

function stats(params: StatsParams){
  switch(params.action) {
    case 'tokensupply': return tokenSupply(params);
  }
}