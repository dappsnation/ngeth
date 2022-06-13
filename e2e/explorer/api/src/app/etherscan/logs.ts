import { GetParams, Logs } from "./types";
import { store } from '../store';

export function getLogs(params: GetParams<Logs>) {
  const {
    fromBlock, toBlock, address, topic0, topic1, topic2, topic3,
    topic0_1_opr, topic0_2_opr, topic0_3_opr, topic1_2_opr, topic1_3_opr, topic2_3_opr
  } = params;
  if (!fromBlock || !toBlock || !address) throw new Error('Error! Missing or invalid Action name');

  return Object.values(store.logs).flat().filter(log => {
    if(log.address !== address) return false;
    if(log.blockNumber <= fromBlock || log.blockNumber >= toBlock ) return false;
    else if (fromBlock === "latest" || toBlock === "latest") return true;
    if(log.topics.filter(topic => {
      if(topic !== topic0 || topic !== topic1 || topic !== topic2 || topic !== topic3) return false;
      return true; 
      }))
    return true;
  })
}