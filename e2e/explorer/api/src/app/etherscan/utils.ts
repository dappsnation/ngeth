interface Sortable {
  blockNumber: number;
}
export const sortByBlockNumber = {
  asc: (a :Sortable, b: Sortable) => a.blockNumber - b.blockNumber,
  desc: (a: Sortable, b: Sortable) => b.blockNumber - a.blockNumber
}