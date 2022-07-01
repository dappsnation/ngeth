import { ABIDescription, EventDescription } from "@type/solc";
import { Config, getAllEvents, getAllFilters, getAllQueries, isEvent } from "./utils";

export const getContractEvents = (contractName: string, abi: ABIDescription[], config: Config) => {
  const events: EventDescription[] = abi.filter(isEvent);
  return `
  export interface ${contractName}Events {
    events: ${getAllEvents(events, config)},
    filters: ${getAllFilters(events, config)},
    queries: ${getAllQueries(events, config)}
  }`
}