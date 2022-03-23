import { BigNumber, Event } from "ethers";

export function erc721Tokens(received: Event[], sent: Event[]) {
  const record: Record<string, number> = {};
  for (const event of received) {
    const tokenId = (event.args?.[2] as BigNumber).toString();
    if (!tokenId) continue;
    if (!record[tokenId]) record[tokenId] = 0;
    record[tokenId]++;
  }
  for (const event of sent) {
    const tokenId = (event.args?.[2] as BigNumber).toString();
    if (!tokenId) continue;
    record[tokenId]--;
  }
  return Object.entries(record)
    .filter(([tokenId, amount]) => amount === 1)
    .map(([tokenId]) => tokenId);
}