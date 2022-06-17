export { EtherscanParams } from '@ngeth/etherscan';
import { EtherscanParams, AccountsParams, ContractParams, TransactionParams, StatsParams, TokenParams, LogParams } from '@ngeth/etherscan';
import { balance, balanceHistory, balanceMulti, getMinedBlocks, tokensTx, txList } from './account';
import { getStatus, getTxReceiptStatus } from './transaction';
import { tokenBalance, tokenBalanceHistoy, tokenSupply, tokenSupplyHistory, tokenInfo } from './tokens';
import { getLogs } from './logs';
import { ethSupply } from './stats';

export function etherscanApi(params: EtherscanParams) {
  switch (params.module) {
    case 'account': return account(params);
    case 'contract': return contract(params);
    case 'transaction': return transaction(params);
    case 'stats': return stats(params);
    case 'token': return token(params);
    case 'logs': return log(params);
  }
}

function account(params: AccountsParams) {
  switch (params.action) {
    case 'balance': return balance(params);
    case 'balancemulti': return balanceMulti(params);
    case 'tokenbalance': return tokenBalance(params);
    case 'tokenbalancehistory': return tokenBalanceHistoy(params);
    case 'txlist': return txList(params);
    case 'getminedblocks': return getMinedBlocks(params);
    case 'balancehistory': return balanceHistory(params);
    case 'tokentx': return tokensTx(params);
    case 'tokennfttx': return tokensTx(params);
    case 'token1155tx': return tokensTx(params);
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

function log(params: LogParams) {
  switch (params.action) {
    case 'getLogs': return getLogs(params);
  }
}

function stats(params: StatsParams) {
  switch (params.action) {
    case 'tokensupply': return tokenSupply(params);
    case 'tokensupplyhistory': return tokenSupplyHistory(params);
    case 'ethsupply': return ethSupply();
  }
}

function token(params: TokenParams) {
  switch (params.action) {
    case 'tokeninfo': return tokenInfo(params);
  }
}