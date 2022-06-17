/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Event } from "ethers";
import { BigNumber } from '@ethersproject/bignumber';

export function erc1155Tokens(
  received: Event[],
  batchReceived: Event[],
  sent: Event[],
  batchSent: Event[]
) {
  const tokens: Record<string, BigNumber> = {};
  for (const event of received) { 
    const [operator, from, to, tokenId, amount] = event.args!;     
    const id = (tokenId as BigNumber).toString();
    if (!tokens[id]) tokens[id] = BigNumber.from(0);
    tokens[id] = tokens[id].add(amount);
  }

  for (const event of batchReceived) {
    const [operator, from, to, tokenIds, amounts] = event.args!;
    for (let i = 0; i< tokenIds.length; i++) {
      const id = (tokenIds[i] as BigNumber).toString();
      if(!tokens[id]) tokens[id] = BigNumber.from(0);
      tokens[id] = tokens[id].add(amounts[i]);
    }
  }

  for (const event of sent) {
    const [operator, from, to, tokenId, amount] = event.args!;
    const id = (tokenId as BigNumber).toString();
    tokens[id] = tokens[id].sub(amount);
    if (tokens[id].isZero()) delete tokens[id];
  }

  for (const event of batchSent) {
    const [operator, from, to, tokensId, amounts] = event.args!;
    for (let i=0; i< tokensId.length; i++) {
      const id = (tokensId[i] as BigNumber).toString();
      tokens[id] = tokens[id].sub(amounts[i]);
      if (tokens[id].isZero()) delete tokens[id];
    }
  }

  return tokens;
}