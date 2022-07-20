import { ERC1193 } from "@ngeth/ethers-core";
import { createContext, PropsWithChildren, useContext } from "react";

export const ChainContext = createContext({});
export const ContractManagerContext = createContext({});
export const ERC1193Context = createContext<ERC1193 | null>(null);

export function NgEth({children}: PropsWithChildren) {
  
  return (
    <ChainContext.Provider value={}>
      <ERC1193Context.Provider value={}>
        <ContractManagerContext.Provider value={}>
          {children}
        </ContractManagerContext.Provider>
      </ERC1193Context.Provider>
    </ChainContext.Provider>
  );
}

export function useChain() {
  return useContext(ChainContext);
}

export function useSigner() {
  const erc1193 = useContext(ERC1193Context);
  if (erc1193) return erc1193.ethersSigner;
}

export function useProvider() {
  const erc1193 = useContext(ERC1193Context);
  if (erc1193) return erc1193.ethersProvider;
}