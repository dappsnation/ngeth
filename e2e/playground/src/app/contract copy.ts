import { BigNumberish, ContractFunction, ContractInterface, Event, PopulatedTransaction, Signer, VoidSigner } from "ethers";
import { Provider, TransactionRequest } from '@ethersproject/providers';
import { EventFilter, BlockTag, Log, FilterByBlockHash, Filter, Listener, TransactionResponse } from "@ethersproject/abstract-provider";
import { Fragment, getContractAddress, Indexed, Interface, isHexString } from "ethers/lib/utils";
import { Observable, ReplaySubject } from "rxjs";
import { MetaMask } from "./metamask";

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

export class BaseContract {

  static getContractAddress(transaction: { from: string, nonce: BigNumberish }): string {
    return getContractAddress(transaction);
  }

  static getInterface(contractInterface: ContractInterface): Interface {
    return getInterface(contractInterface);
  }

  static isIndexed(value: any): value is Indexed {
    return Indexed.isIndexed(value);
  }

  address: string;
  
  signer?: Signer;
  provider?: MetaMask;
  
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

  // A list of RunningEvents to track listeners for each event tag
  private _runningEvents: Record<string, RunningEvent> = {};

  private _events: Record<string, Observable<any>> = {};

  // Wrapped functions to call emit and allow deregistration from the provider
  private _wrappedEmits: Record<string, (...args: Array<any>) => void> = {};

  constructor(addressOrName: string, contractInterface: ContractInterface, signerOrProvider?: Signer | Provider) {

    // Provider / Signer
    if (Signer.isSigner(signerOrProvider)) {
      this.signer = signerOrProvider;
      this.provider = signerOrProvider.provider;
    } else if (Provider.isProvider(signerOrProvider)) {
      this.provider = signerOrProvider;
    } else if (!!signerOrProvider) {
      throw new Error(`invalid signer or provider for "signerOrProvider": ${JSON.stringify(signerOrProvider)}`);
    }

    
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
        this.resolvedAddress = getAddress(this.provider, addressOrName);
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
      (this as any)[name] = buildDefault(this, fragment, true);
      this.functions[name] = buildDefault(this, fragment, false);
      this.callStatic[name] = buildCall(this, fragment, true);
      this.populateTransaction[name] = buildPopulate(this, fragment);
      this.estimateGas[name] = buildEstimate(this, fragment);
    }
  }


  // @TODO: Allow timeout?
  deployed(): Promise<typeof this> {
    return this._deployed();
  }

  private _deployed(blockTag?: BlockTag): Promise<typeof this> {
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
  connect(signerOrProvider: Signer | Provider | string): void {
    if (typeof signerOrProvider === "string") {
      signerOrProvider = new VoidSigner(signerOrProvider, this.provider);
    }
    this.signer = signerOrProvider;
  }

  // Re-attach to a different on-chain instance of this contract
  attach(addressOrName: string): void {
    this.address = addressOrName;
  }


  private _normalizeRunningEvent(runningEvent: RunningEvent): RunningEvent {
    // Already have an instance of this event running; we can re-use it
    if (this._runningEvents[runningEvent.tag]) {
      return this._runningEvents[runningEvent.tag];
    }
    return runningEvent
  }

  /** Transform event name into an EventFilter */
  private getEventFilter(name: string): EventFilter {
    if (name === 'error') return;
    if (name === 'event') return;
    if (name === '*') return;
    const fragment = this.interface.getEvent(name);
    const topic = this.interface.getEventTopic(fragment);
    return { address: this.address, topics: [topic] }
  }

  private _getRunningEvent(eventName: EventFilter | string): RunningEvent {
    if (typeof eventName === "string") {
      // Listen for "error" events (if your contract has an error event, include
      // the full signature to bypass this special event keyword)
      if (eventName === "error") return this._normalizeRunningEvent(new ErrorRunningEvent());

      // Listen for any event that is registered
      if (eventName === "event") return this._normalizeRunningEvent(new RunningEvent("event", null));

      // Listen for any event
      if (eventName === "*") return this._normalizeRunningEvent(new WildcardRunningEvent(this.address, this.interface));

      // Get the event Fragment (throws if ambiguous/unknown event)
      const fragment = this.interface.getEvent(eventName);
      const topics = [this.interface.getEventTopic(fragment)];
      return this._normalizeRunningEvent(new FragmentRunningEvent(this.address, this.interface, fragment));
    }

    // We have topics to filter by...
    if (eventName.topics && eventName.topics.length > 0) {
      // Is it a known topichash? (throws if no matching topichash)
      try {
          const topic = eventName.topics[0];
          if (typeof topic !== "string") {
            throw new Error("invalid topic"); // @TODO: May happen for anonymous events
          }
          const fragment = this.interface.getEvent(topic);
          return this._normalizeRunningEvent(new FragmentRunningEvent(this.address, this.interface, fragment, eventName.topics));
      } catch (error) { }

      // Filter by the unknown topichash
      const filter: EventFilter = {
        address: this.address,
        topics: eventName.topics
      }

      return this._normalizeRunningEvent(new RunningEvent(getEventTag(filter), filter));
    }

    return this._normalizeRunningEvent(new WildcardRunningEvent(this.address, this.interface));
  }

  private _checkRunningEvents(runningEvent: RunningEvent): void {
    if (runningEvent.listenerCount() === 0) {
      delete this._runningEvents[runningEvent.tag];

      // If we have a poller for this, remove it
      const emit = this._wrappedEmits[runningEvent.tag];
      if (emit && runningEvent.filter) {
          this.provider.off(runningEvent.filter, emit);
          delete this._wrappedEmits[runningEvent.tag];
      }
    }
  }

  // Subclasses can override this to gracefully recover
  // from parse errors if they wish
  protected _wrapEvent(runningEvent: RunningEvent, log: Log, listener: Listener): Event {
    const event = <Event>deepCopy(log);

    event.removeListener = () => {
        if (!listener) return;
        runningEvent.removeListener(listener);
        this._checkRunningEvents(runningEvent);
    };

    event.getBlock = () => this.provider!.getBlock(log.blockHash);
    event.getTransaction = () => this.provider!.getTransaction(log.transactionHash);
    event.getTransactionReceipt = () => this.provider!.getTransactionReceipt(log.transactionHash);

    // This may throw if the topics and data mismatch the signature
    runningEvent.prepareEvent(event);

    return event;
  }

  private _addEventListener(runningEvent: RunningEvent, listener: Listener, once: boolean): void {
    if (!this.provider) {
      throw new Error("events require a provider or a signer with a provider");
    }

    runningEvent.addListener(listener, once);

    // Track this running event and its listeners (may already be there; but no hard in updating)
    this._runningEvents[runningEvent.tag] = runningEvent;

    // If we are not polling the provider, start polling
    if (!this._wrappedEmits[runningEvent.tag]) {
      const wrappedEmit = (log: Log) => {
        const event = this._wrapEvent(runningEvent, log, listener);

        // Try to emit the result for the parameterized event...
        if (event.decodeError == null) {
          try {
            const args = runningEvent.getEmit(event);
            this.emit(runningEvent.filter, ...args);
          } catch (error) {
            event.decodeError = (error as any).error;
          }
        }

        // Always emit "event" for fragment-base events
        if (runningEvent.filter != null) {
          this.emit("event", event);
        }

        // Emit "error" if there was an error
        if (event.decodeError != null) {
          this.emit("error", event.decodeError, event);
        }
      };
      this._wrappedEmits[runningEvent.tag] = wrappedEmit;

      // Special events, like "error" do not have a filter
      if (runningEvent.filter != null) {
          this.provider.on(runningEvent.filter, wrappedEmit);
      }
    }
  }

  async queryFilter(event: EventFilter, fromBlockOrBlockhash?: BlockTag | string, toBlock?: BlockTag): Promise<Array<Event>> {
    if (!this.provider) {
      throw new Error("events require a provider or a signer with a provider");
    }
    const runningEvent = this._getRunningEvent(event);
    const filter = shallowCopy(runningEvent.filter);

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
    return logs.map((log) => this._wrapEvent(runningEvent, log, null));
  }

  from(event: EventFilter | string) {
    if (!this.provider) throw new Error('Provider required for event');
    const eventFilter = typeof event === 'string' ? this.getEventFilter(event) : event;
    const tag = getEventTag(eventFilter);
    if (!this._events[tag]) {
      this._events[tag] = this.provider.fromEvent(eventFilter);
    }
    return this._events[tag].asObservable();
  }

  emitEvent(event: EventFilter | string, ...args: any[]) {
    if (!this.provider) return false;
    const eventFilter = typeof event === 'string' ? this.getEventFilter(event) : event;
    const tag = getEventTag(eventFilter);

    this._events[tag].next(args);
  }







  on(event: EventFilter | string, listener: Listener): this {

      this._addEventListener(this._getRunningEvent(event), listener, false);
      return this;
  }

  once(event: EventFilter | string, listener: Listener): this {
      this._addEventListener(this._getRunningEvent(event), listener, true);
      return this;
  }

  emit(event: EventFilter | string, ...args: Array<any>): boolean {
      if (!this.provider) return false;

      const runningEvent = this._getRunningEvent(event);
      const result = (runningEvent.run(args) > 0);

      // May have drained all the "once" events; check for living events
      this._checkRunningEvents(runningEvent);

      return result;
  }

  listenerCount(eventName?: EventFilter | string): number {
      if (!this.provider) return 0;
      if (eventName == null) {
          return Object.keys(this._runningEvents).reduce((accum, key) => {
              return accum + this._runningEvents[key].listenerCount();
          }, 0);
      }
      return this._getRunningEvent(eventName).listenerCount();
  }

  listeners(eventName?: EventFilter | string): Array<Listener> {
    if (!this.provider) return [];

    if (eventName == null) {
      const result: Array<Listener> = [ ];
      for (let tag in this._runningEvents) {
        this._runningEvents[tag].listeners().forEach((listener) => result.push(listener));
      }
      return result;
    }

    return this._getRunningEvent(eventName).listeners();
  }

  removeAllListeners(eventName?: EventFilter | string): this {
      if (!this.provider) return this;

      if (eventName == null) {
          for (const tag in this._runningEvents) {
              const runningEvent = this._runningEvents[tag];
              runningEvent.removeAllListeners();
              this._checkRunningEvents(runningEvent);
          }
          return this;
      }

      // Delete any listeners
      const runningEvent = this._getRunningEvent(eventName);
      runningEvent.removeAllListeners();
      this._checkRunningEvents(runningEvent);

      return this;
  }

  off(eventName: EventFilter | string, listener: Listener): this {
      if (!this.provider) return this;
      const runningEvent = this._getRunningEvent(eventName);
      runningEvent.removeListener(listener);
      this._checkRunningEvents(runningEvent);
      return this;
  }

  removeListener(eventName: EventFilter | string, listener: Listener): this {
      return this.off(eventName, listener);
  }

}