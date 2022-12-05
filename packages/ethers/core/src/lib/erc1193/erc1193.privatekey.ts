import { getAddress } from '@ethersproject/address';
import { JsonRpcProvider, getDefaultProvider, WebSocketProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ERC1193 } from './erc1193';
import { getChain, toChainId } from '../chain/utils';
import { AddChainParameter, ERC1193Provider, NgERC1193Events, RequestArguments, WalletProfile, WatchAssetParams } from './types';
import { fromAddChain } from './utils';
import { Chain } from '../chain/types';

const HARDHAT_PRIVATEKEYS = [
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
]

export class DefaultProvider implements ERC1193Provider {
  chainId?: string | undefined;
  networkVersion?: string | undefined;
  selectedAddress?: string | undefined;
  
  private accounts: Record<string, Wallet> = {};
  private provider: JsonRpcProvider | WebSocketProvider;
  private chains: Record<number, Chain> = {};

  constructor(url = 'http://localhost:8545', privateKeys: string[] = HARDHAT_PRIVATEKEYS) {
    this.provider = getDefaultProvider(url) as JsonRpcProvider | WebSocketProvider;
    for (const privateKey of privateKeys) {
      const wallet = new Wallet(privateKey);
      this.accounts[wallet.address] = wallet;
    }
  }


  /////////////
  // ERC1193 //
  /////////////

  private async requestAccounts() {
    const addresses = Object.keys(this.accounts);
    if (!addresses.length) return [];
    this.selectedAddress = addresses[0];
    return [this.selectedAddress];
  }

  private async switchChain([{ chainId }]: [{ chainId: string }]) {
    const chain = this.chains[toChainId(chainId)] ?? await getChain(chainId);
    // make sure we remove all listener from the current provider
    this.provider.removeAllListeners();
    this.provider = getDefaultProvider(chain.rpc[0]) as JsonRpcProvider | WebSocketProvider;
    this.chainId = chainId;
  }

  private addChain([addChain]: [AddChainParameter]) {
    const chain = fromAddChain(addChain);
    this.chains[chain.chainId] = chain;
  }

  private watchAsset([asset]: [WatchAssetParams]) {
    throw new Error('Method "wallet_watchAsset" is not yet supported by the FallbackProvider')
  }

  ////////////
  // SIGNER //
  ////////////

  async ethAccounts() {
    return Object.keys(this.accounts);
  }

  async sign(value: string) {
    if (!this.selectedAddress) throw new Error('No wallet connected');
    return this.accounts[this.selectedAddress].signMessage(value);
  }

  ////////////
  // EVENTS //
  ////////////

  // TODO: Implement event emitter

  on<K extends keyof NgERC1193Events>(event: K, listener: NgERC1193Events[K]) {
    return this.provider.on(event, listener);
  }
  once<K extends keyof NgERC1193Events>(event: K, listener: NgERC1193Events[K]) {
    return this.provider.once(event, listener);
  }
  addListener<K extends keyof NgERC1193Events>(event: K, listener: NgERC1193Events[K]) {
    return this.provider.addListener(event, listener);
  }
  removeListener<K extends keyof NgERC1193Events>(event: K, listener: NgERC1193Events[K]) {
    return this.provider.removeListener(event, listener);
  }
  removeAllListeners(event: keyof NgERC1193Events) {
    return this.provider.removeAllListeners(event);
  }

  isConnected(): boolean {
    return !!this.selectedAddress;
  }

  send<T>({ method, params }: RequestArguments): Promise<T> {
    if (!params) return this.provider.send(method, []);
    const parameters = Array.isArray(params) ? params : [params];
    return this.provider.send(method, parameters);
  }

  request<T>(args: RequestArguments): Promise<T> {
    const params = args.params as any[];
    switch(args.method) {
      case 'eth_accounts': return this.ethAccounts() as any;
      case 'personal_sign': return this.sign(params[0] as string) as any;
      case 'eth_sign': return this.sign(params[1] as string) as any;
      case 'eth_signTypedData_v4': return this.sign(params[1] as string) as any;
      case 'eth_requestAccounts': return this.requestAccounts() as any;
      case 'wallet_switchEthereumChain': return this.switchChain(params as any) as any;
      case 'wallet_addEthereumChain': return this.addChain(params as any) as any;
      case 'wallet_watchAsset': return this.addChain(params as any) as any;
      default: return this.send<T>(args)
    }
  }
}



export class PrivatekeyERC1193 extends ERC1193 {
  wallet: WalletProfile;
  wallets: WalletProfile[] = [];

  constructor() {
    super();
    const wallet = { label: 'default', provider: new DefaultProvider() };
    this.wallets.push(wallet);
    this.wallet = wallet;
  }

  protected override onInit() {
    this.selectWallet(this.wallet);
  }

  protected onWalletChange(wallet: WalletProfile) {
    this.wallet = wallet;
    localStorage.setItem('ngeth:erc1193', wallet.label);
  }

  protected async getWallet() {
    return this.wallet;
  }

  get account() {
    if (!this.provider?.selectedAddress) return;
    return getAddress(this.provider.selectedAddress);
  }

  get chainId() {
    if (!this.provider?.chainId) return;
    return toChainId(this.provider.chainId);
  }
}