export { EtherscanParams } from './types';
import { EtherscanParams, AccountsParams, ContractParams } from './types';
import { balance, balancemulti } from './account';

export function etherscanApi(params: EtherscanParams) {
  switch (params.module) {
    case 'account': return account(params);
    case 'contract': return contract(params);
  }
}

function account(params: AccountsParams) {
  switch (params.action) {
    case 'balance': return balance(params);
    case 'balancemulti': return balancemulti(params);
    default: return {};
  }
}

function contract(params: ContractParams) {
  switch (params.action) {
    default: return {};
  }
}