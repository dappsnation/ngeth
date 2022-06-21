import { AddChainParameter, ERC1193Events, ERC1193Param, ERC1193Provider, WalletProfile, WatchAssetParams } from './types';
import { Observable } from 'rxjs';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
export declare abstract class ERC1193<Wallet extends WalletProfile = WalletProfile> {
    #private;
    private zone;
    walletChanges: Observable<Wallet | null>;
    protected provider?: ERC1193Provider;
    abstract account?: string;
    abstract chainId?: number;
    abstract wallets: Wallet[];
    /** Method used to ask the user which wallet to select if multiple wallet available */
    protected abstract getWallet(): Promise<Wallet | undefined>;
    /** Observe if current account is connected */
    connected$: Observable<boolean | undefined>;
    /**
     * First account connected to the dapp, if any
     * @note This might not be the selected account in Metamask
     */
    account$: Observable<string | undefined>;
    /**
     * Current account. Doesn't emit until therer is a connected account
     * @note ⚠️ Only use if you're sure there is an account (inside a guard for example)
     */
    currentAccount$: Observable<string>;
    chainId$: Observable<number>;
    message$: Observable<import("./types").ProviderMessage>;
    get ethersProvider(): Web3Provider | undefined;
    get ethersSigner(): JsonRpcSigner | undefined;
    /** Listen on event from MetaMask Provider */
    protected fromEvent<K extends keyof ERC1193Events>(wallet: Wallet, event: K, initial?: ERC1193Param<K>): Observable<ERC1193Param<K>>;
    /** Select a wallet to setup the provider & signer */
    selectWallet(wallet?: Wallet): Promise<void>;
    /** Select a wallet and connect to it */
    enable(wallet?: Wallet): Promise<string[]>;
    /**
     * Request user to change chain
     * @note If the error code (error.code) is 4902, then the requested chain has not been added by MetaMask, and you have to request to add it via addChain
     * @param id The 0x-non zero chainId or decimal number
     */
    switchChain(id: string | number): Promise<null> | undefined;
    addChain(chain: AddChainParameter | string): Promise<null | undefined>;
    watchAsset(params: WatchAssetParams['options']): Promise<boolean> | undefined;
}
