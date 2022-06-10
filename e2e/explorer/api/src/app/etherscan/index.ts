export { EtherscanParams } from './types';
import { EtherscanParams, AccountsParams, ContractParams, TransactionParams, StatsParams, TokenParams } from './types';
import { balance, balanceMulti } from './account';
import { getStatus, getTxReceiptStatus } from './transaction';
import { tokenBalance, tokenBalanceHistoy, tokenSupply, tokenSupplyHistory, tokenInfo } from './tokens';

export function etherscanApi(params: EtherscanParams) {
  switch (params.module) {
    case 'account': return account(params);
    case 'contract': return contract(params);
    case 'transaction': return transaction(params);
    case 'stats': return stats(params);
    case 'token': return token(params);
  }
}

function account(params: AccountsParams) {
  switch (params.action) {
    case 'balance': return balance(params);
    case 'balancemulti': return balanceMulti(params);
    case 'tokenbalance': return tokenBalance(params);
    case 'tokenbalancehistory': return tokenBalanceHistoy(params);
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

function stats(params: StatsParams) {
  switch (params.action) {
    case 'tokensupply': return tokenSupply(params);
    case 'tokensupplyhistory': return tokenSupplyHistory(params);
  }
}

function token(params: TokenParams) {
  switch (params.action) {
    case 'tokeninfo': return tokenInfo(params);
  }
}