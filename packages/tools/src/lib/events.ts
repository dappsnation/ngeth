import { ABIDescription, EventDescription } from "@type/solc";
import { getAllEvents, getAllFilters, getAllQueries, isEvent } from "./utils";

export const getContractEvents = (contractName: string, abi: ABIDescription[]) => {
  const events: EventDescription[] = abi.filter(isEvent);
  return `
  export interface ${contractName}Events {
    events: ${getAllEvents(events)},
    filters: ${getAllFilters(events)},
    queries: ${getAllQueries(events)}
  }`
}