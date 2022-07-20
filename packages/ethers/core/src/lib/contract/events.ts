// import { BaseContract, EventFilter } from "@ethersproject/contracts";
// import { Log } from "@ethersproject/providers";
// import { EthersContract, TypedFilter } from "./contract";

// export type GetEvents<T> = T extends EthersContract<infer I> ? I : never;

// function getEventTag(filter: EventFilter): string {
//   const emptyTopics = !filter.topics || !filter.topics.length;
//   if (filter.address && emptyTopics) return '*';

//   const address = filter.address ?? '*';
//   const topics = (filter.topics ?? []).map((topic) =>
//     Array.isArray(topic) ? topic.join('|') : topic
//   );
//   return `${address}:${topics}`;
// }
// function getEventFilter(contract: BaseContract, name: string): EventFilter {
//   if (name === 'error') throw new Error('"error" event is not implemented yet');
//   if (name === 'event') throw new Error('"event" event is not implemented yet');
//   if (name === '*') throw new Error('"*" event is not implemented yet');
//   const fragment = contract.interface.getEvent(name);
//   const topic = contract.interface.getEventTopic(fragment);
//   return { address: contract.address, topics: [topic] };
// }

// export function contractEvent<
//   Contract extends EthersContract<any>,
//   K extends GetEvents<Contract>['queries'],
// >(contract: Contract, filter: TypedFilter<K>, handler: (args: GetEvents<Contract>['queries'][K]) => any) {
//   const listener = (log: Log) => {
//     const description = contract.interface.parseLog(log);
//     handler(description.args as GetEvents<Contract>['queries'][K]);
//   }
//   contract.provider.addListener(filter, listener);
//   return () => contract.provider.removeListener(filter, listener);
// }

// export class EventManager<
//   Contract extends EthersContract<any>,
//   K extends GetEvents<Contract>['queries'],
// > {
//   value: GetEvents<Contract>['queries'][K][] = []
//   callbacks: Record<symbol | string, (args: GetEvents<Contract>['queries'][K][]) => any> = {}

//   constructor(contract: Contract, eventFilter: TypedFilter<K>) {
//     contract.queryFilter(eventFilter)
//       .then((init) => this.onValue(init.map(e => e.args)))
//       .then(() => contractEvent<Contract, K>(contract, eventFilter, this.onValue))
//   }

//   onValue(res: GetEvents<Contract>['queries'][K] | GetEvents<Contract>['queries'][K][]) {
//     this.value = this.value.concat(res);
//     this.emit();
//   }
//   emit() {
//     Object.values(this.callbacks).forEach(cb => cb(this.value));
//   }
// }

// export function contractFilter<
//   Contract extends EthersContract<any>,
//   K extends GetEvents<Contract>['queries'],
// >(
//   contract: Contract,
//   filter: TypedFilter<K> | K,
//   callback: (args: GetEvents<Contract>['queries'][K][]) => any
// ) {
//   const eventFilter: TypedFilter<K> = typeof filter === 'string'
//     ? getEventFilter(contract, filter)
//     : filter;
//   const tag = getEventTag(eventFilter);
//   if (!contract['__events__']) contract['__events__'] = {};
//   if (!contract['__events__'][tag]) {
//     contract['__events__'][tag] = new EventManager<Contract, K>(contract, eventFilter);
//   }
//   const id = Symbol();
//   const event = contract['__events__'][tag] as EventManager<Contract, K>;
//   event.callbacks[id](callback);
//   return () => {
//     delete event.callbacks[id];
//     if (!Object.keys(event.callbacks).length) {
//       contract.off(eventFilter, event.listener);
//     }
//   }
// }


