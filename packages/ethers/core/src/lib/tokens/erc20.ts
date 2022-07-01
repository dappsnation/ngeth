import type { Event } from "@ethersproject/contracts";
import type { BigNumber } from '@ethersproject/bignumber';
import { sum } from "./utils";

export function erc20Balance(received: Event[], sent: Event[]) {
  const toAdd = sum(received, event => event.args?.[2] as BigNumber);
  const toRemove = sum(sent, event => event.args?.[2] as BigNumber);
  return toAdd.sub(toRemove);
}
