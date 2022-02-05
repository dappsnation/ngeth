/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BigNumberish, ContractFunction, ContractInterface, Event, PopulatedTransaction, Signer, VoidSigner } from "ethers";
import { Provider, TransactionRequest, Web3Provider } from '@ethersproject/providers';
import { EventFilter, BlockTag, Log, FilterByBlockHash, Filter, TransactionResponse } from "@ethersproject/abstract-provider";
import { EventFragment, Fragment, getAddress, getContractAddress, Indexed, Interface, isHexString, BytesLike } from "ethers/lib/utils";
import { map, Observable, shareReplay } from "rxjs";
import { fromEthEvent } from "./metamask";
import { buildCall, buildDefault, resolveName } from "./contract.utils";
import { inject, NgZone } from "@angular/core";

type Filters = Record<string, (...args: Array<any>) => EventFilter>;

function getInterface(contractInterface: ContractInterface) {
  if (Interface.isInterface(contractInterface)) {
      return contractInterface;
  }
  return new Interface(contractInterface);
}

function getEventTag(filter: EventFilter): string {
  const emptyTopics = !filter.topics || !filter.topics.length;
  if (filter.address && emptyTopics) return "*";

  const address = filter.address ?? '*';
  const topics = (filter.topics ?? []).map(topic => Array.isArray(topic) ? topic.join('|') : topic);
  return `${address}:${topics}`;
}


function getDuplicateValue(record: Record<string, Fragment>) {
  const unique:Record<string, string[]> = {};
  for (const [key, fragment] of Object.entries(record)) {
    const name = fragment.name;
    if (!unique[name]) unique[name] = [];
    unique[name].push(key);
  }
  return Object.entries(unique).filter(([key, value]) => value.length > 1);
}

function warnDuplicates(duplicates: [string, string[]][]) {
  for (const [name, signatures] of duplicates) {
    console.warn(`Duplicate definition of ${name} (${signatures.join(', ')})`)
  }
}

export class NgContract {
  address: string;
  signer?: Signer;
  provider?: Provider;

  private ngZone = inject(NgZone);
  
  readonly interface: Interface;
  readonly functions: Record<string, ContractFunction> = {};

  readonly callStatic: Record<string, ContractFunction> = {};
  readonly estimateGas: Record<string, ContractFunction<BigNumberish>> = {};
  readonly populateTransaction: Record<string, ContractFunction<PopulatedTransaction>> = {};

  readonly filters: Filters = {};

  // This will always be an address. This will only differ from
  // address if an ENS name was used in the constructor
  readonly resolvedAddress: Promise<string>;

  // This is only set if the contract was created with a call to deploy
  readonly deployTransaction?: TransactionResponse;

  private _deployedPromise?: Promise<typeof this>;

  private _events: Record<string, Observable<any>> = {};


  static getContractAddress(transaction: { from: string, nonce: BigNumberish }): string {
    return getContractAddress(transaction);
  }

  static getInterface(contractInterface: ContractInterface): Interface {
    return getInterface(contractInterface);
  }

  static isIndexed(value: any): value is Indexed {
    return Indexed.isIndexed(value);
  }

  constructor(addressOrName: string, contractInterface: ContractInterface, signerOrProvider?: Signer | Provider) {

    // Provider / Signer
    this.connect(signerOrProvider);
    
    this.interface = getInterface(contractInterface);

  
    // Filters
    // Verify same name for different signature
    const eventDuplicates = getDuplicateValue(this.interface.events);
    warnDuplicates(eventDuplicates);

    for (const event of Object.values(this.interface.events)) {
      this.filters[event.name] = (...args: any[]) => ({
        address: this.address,
        topics: this.interface.encodeFilterTopics(event, args)
      });
    }

    // Address
    if (addressOrName == null) {
      throw new Error(`Invalid contract address or ENS name for "addressOrName": ${JSON.stringify(addressOrName)}`);
    }
    this.address = addressOrName;

    if (this.provider) {
      this.resolvedAddress = resolveName(this.provider, addressOrName);
    } else {
      try {
        this.resolvedAddress = Promise.resolve(getAddress(addressOrName));
      } catch (error) {
        // Without a provider, we cannot use ENS names
        throw new Error("provider is required to use ENS name as contract address");
      }
    }

    // Functions
    const functionsDuplicates = getDuplicateValue(this.interface.functions);
    warnDuplicates(functionsDuplicates);
    for (const fragment of Object.values(this.interface.functions)) {
      const name = fragment.name;
      (this as any)[name] = buildDefault(this, fragment);
      this.functions[name] = buildDefault(this, fragment);
      this.callStatic[name] = buildCall(this, fragment);
      // TODO:
      // this.populateTransaction[name] = buildPopulate(this, fragment);
      // this.estimateGas[name] = buildEstimate(this, fragment);
    }
  }


  // @TODO: Allow timeout?
  deployed(blockTag?: BlockTag): Promise<typeof this> {
    if (!this._deployedPromise) {
      // If we were just deployed, we know the transaction we should occur in
      if (this.deployTransaction) {
        this._deployedPromise = this.deployTransaction.wait().then(() =>  this);
      } else {
        if (!this.provider) throw new Error('Provider required to wait for deploy');
  
        this._deployedPromise = this.provider.getCode(this.address, blockTag).then((code) => {
          if (code === "0x") throw new Error("contract not deployed");
          return this;
        });
      }
    }
    return this._deployedPromise;
  }

  // @TODO:
  // estimateFallback(overrides?: TransactionRequest): Promise<BigNumber>

  // @TODO:
  // estimateDeploy(bytecode: string, ...args): Promise<BigNumber>

  protected async fallback(overrides?: TransactionRequest): Promise<TransactionResponse> {
    if (!this.signer) {
      throw new Error("sending a transactions require a signer");
    }

    const tx: Partial<TransactionRequest> = { ...overrides } || {};
    if (tx.from) throw new Error("cannot override key 'from'");
    if (tx.to) throw new Error("cannot override key 'to'");

    tx.to = await this.resolvedAddress;
    await this.deployed();
    return this.signer.sendTransaction(tx);
  }

  //////////////////

  // Reconnect to a different signer or provider
  connect(signerOrProvider?: Signer | Provider | string): void {
    if (!signerOrProvider) return;
    if (typeof signerOrProvider === "string") {
      signerOrProvider = new VoidSigner(signerOrProvider, this.provider);
    }
    if (Provider.isProvider(signerOrProvider)) {
      if (signerOrProvider instanceof Web3Provider) this.signer = signerOrProvider.getSigner();
      this.provider = signerOrProvider;
    } else if (Signer.isSigner(signerOrProvider)) {
      this.signer = signerOrProvider;
      this.provider = signerOrProvider.provider;
    } else if (signerOrProvider) {
      throw new Error(`invalid signer or provider for "signerOrProvider": ${JSON.stringify(signerOrProvider)}`);
    }
  }

  // Re-attach to a different on-chain instance of this contract
  attach(addressOrName: string): void {
    this.address = addressOrName;
  }

  /** Transform event name into an EventFilter */
  private getEventFilter(name: string): EventFilter {
    if (name === 'error') throw new Error('"error" event is not implemented yet');
    if (name === 'event') throw new Error('"event" event is not implemented yet');
    if (name === '*') throw new Error('"*" event is not implemented yet');
    const fragment = this.interface.getEvent(name);
    const topic = this.interface.getEventTopic(fragment);
    return { address: this.address, topics: [topic] }
  }

  private logToEvent(log: Log, fragment: EventFragment): Event {
    return {
      ...log,
      event: fragment.name,
      eventSignature: fragment.format(),
      args: this.interface.decodeEventLog(fragment, log.data, log.topics),
      getBlock: () => this.provider!.getBlock(log.blockHash),
      getTransaction: () => this.provider!.getTransaction(log.transactionHash),
      getTransactionReceipt: () => this.provider!.getTransactionReceipt(log.transactionHash),
      decode: (data: BytesLike, topics?: Array<string>) => {
        return this.interface.decodeEventLog(fragment, data, topics);
      },
      // Required for Event, but not used as events are managed by Observable
      removeListener: () => undefined
    }
  }

  private getFragment(event: EventFilter) {
    const topic = event.topics?.[0];
    if (typeof topic !== 'string') throw new Error("Invalid topic");
    return this.interface.getEvent(topic);
  }

  async queryFilter(event: EventFilter, fromBlockOrBlockhash?: BlockTag | string, toBlock?: BlockTag): Promise<Event[]> {
    if (!this.provider) throw new Error("events require a provider or a signer with a provider");
    const fragment = this.getFragment(event);
    
    const filter = { ...event };

    if (typeof fromBlockOrBlockhash === "string" && isHexString(fromBlockOrBlockhash, 32)) {
      if (toBlock != null) {
        throw new Error(`Cannot specify toBlock "${toBlock}" with blockhash`);
      }
      (filter as FilterByBlockHash).blockHash = fromBlockOrBlockhash;
    } else {
      (filter as Filter).fromBlock = fromBlockOrBlockhash ?? 0;
      (filter as Filter).toBlock =  toBlock ?? "latest";
    }

    const logs = await this.provider.getLogs(filter);
    return logs.map((log) => this.logToEvent(log, fragment));
  }

  from(event: EventFilter | string) {
    if (!this.provider) throw new Error('Provider required for event');
    const eventFilter = typeof event === 'string' ? this.getEventFilter(event) : event;
    const fragment = this.getFragment(eventFilter);
    const tag = getEventTag(eventFilter);
    if (!this._events[tag]) {
      this._events[tag] = fromEthEvent<Log>(this.provider, this.ngZone, eventFilter).pipe(
        map(log => this.logToEvent(log, fragment)),
        shareReplay(1)
      );
    }
    return this._events[tag];
  }
}