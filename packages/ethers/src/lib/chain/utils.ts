import { Chain, ChainIcon } from "./types";

export function getChain(chainId: string): Promise<Chain> {
  const id = parseInt(chainId); // transform into decimals
  const url = `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${id}.json`;
  return fetch(url).then(res => res.json());
}

export function getChainIcons(name: string, format?: ChainIcon['format']): Promise<ChainIcon> {
  const url = `https://github.com/ethereum-lists/chains/blob/master/_data/icons/${name}.json`;
  return fetch(url)
    .then(res => res.json())
    .then((icons: ChainIcon[]) => {
      if (!format) return icons[0];
      return icons.find(icon => icon.format === format) ?? icons[0];
    });
}

export function explore(chain: Chain, search: string) {
  if (!chain.explorers.length) throw new Error(`No Explorer provided for chain "${chain.name}"`);
  return `${chain.explorers[0].url}/search?q=${search}`;
}
