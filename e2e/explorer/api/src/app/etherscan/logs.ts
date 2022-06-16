import { GetParams, Logs } from "@ngeth/etherscan";
import { store } from '../store';

export function getLogs(params: GetParams<Logs>) {
  let {fromBlock, toBlock} = params;  
  if (!fromBlock || !toBlock || !params.address) throw new Error('Error! Missing or invalid Action name');
  if (typeof fromBlock === "string" && fromBlock !== "latest") {
    throw new Error('Only "latest" is supported as a blocktag for "fromBlock". Got' +fromBlock);
  }
  if (typeof toBlock === "string" && toBlock !== "latest") {
    throw new Error('Only "latest" is supported as a blocktag for "toBlock". Got' + toBlock);
  }
  
  if (fromBlock === "latest") fromBlock = store.blocks.length - 1;
  if (toBlock === "latest") toBlock = store.blocks.length - 1;

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
    if (log.address !== params.address) return false;
    if (log.blockNumber < fromBlock || log.blockNumber > toBlock ) return false;
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