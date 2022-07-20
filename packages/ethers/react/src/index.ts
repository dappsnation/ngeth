import { GetEvents } from "@ngeth/ethers-angular";
import { ContractEvents, EthersContract, TypedFilter } from "@ngeth/ethers-core";
import { Contract, EventFilter, Signer } from "ethers";
import { useEffect, useMemo, useState } from "react";

type ContractConstructor<Contract extends EthersContract<any>> = new (address: string, signer?: Signer) => Contract;
type GetInstance<T extends ContractConstructor<any>> = T extends ContractConstructor<infer I> ? I : never;

export function useContract<
  Base extends ContractConstructor<Contract>,
  Contract extends EthersContract<any> = GetInstance<Base>
>(baseContract: Base, address: string, signer?: Signer) {
  return useMemo(() => new baseContract(address, signer), [baseContract, address, signer])
}

export function useContractEvent<
  Contract extends EthersContract<Events>,
  K extends Extract<keyof Events['events'], string>,
  Events extends ContractEvents<any, any> = GetEvents<Contract>,
>(contract: Contract, filter: TypedFilter<K> | K, initial?: Parameters<Events['events'][K]>) {
  const [value, setValue] = useState<Parameters<Events['events'][K]>>(initial ?? [] as any);
  useEffect(() => {
    const listener: any = (...args: Parameters<Events['events'][K]>) => setValue(args);
    contract.on<K>(filter, listener);
    return () => {
      contract.off(filter, listener);
    }
  }, [contract, filter]);
  return value;
}