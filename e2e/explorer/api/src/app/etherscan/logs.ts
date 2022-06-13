import { GetParams, Logs } from "./types";
import { store } from '../store';

export function getLogs(params: GetParams<Logs>) {
  const { fromBlock, toBlock, address } = params;
  if (!fromBlock || !toBlock || !address) throw new Error('Error! Missing or invalid Action name');

  let filter: {from: number; to: number; operator: 'or' | 'and' };
  from:
  for (let i = 0; i<3; i++) {
    for (let j = i +1; j<4; j++) {
      const operator = params[`topic${i}_${j}_opr` as any];
      if(operator) {
        filter = { from: i, to: j, operator};
        break from;
      }
    }
  };
  if (!filter) {
    filter = { from: 0, to: 3, operator: "and" };
  }

  // todo check if toBlock/fromBlock is latest mutate them in block.lenght-1

  return Object.values(store.logs).flat().filter(log => {
    if(log.address !== address) return false;
    if(log.blockNumber <= fromBlock || log.blockNumber >= toBlock ) return false;
    if (filter.operator === "and") {
      for (let i = filter.from; i <= filter.to; i++) {
        if (!params[`topic${i}`]) continue;
        if(params[`topic${i}` as any] !== log.topics[i]) return false;
      }
      return true;
    } else if (filter.operator === "or") {
      for (let i = filter.from; i <= filter.to; i++) {
        if (params[`topic${i}` as any] === log.topics[i]) return true;
      }
      return false;
    }
  throw new Error('Operator should be either "and" or "or"');
  })
}