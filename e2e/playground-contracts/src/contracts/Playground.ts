import { TypedContract, FilterParam, TypedFilter } from "./common";
import { BigNumber, Overrides, CallOverrides, PayableOverrides, Signer } from "ethers";
import { Provider, TransactionResponse } from "@ethersproject/providers";
import env from "../../environments/environment";

interface PlaygroundEvents {
  Contribution: (from: string, amount: BigNumber) => void;
}
interface PlaygroundFilters {
  Contribution: (from?: FilterParam<string>, amount?: FilterParam<BigNumber>) => TypedFilter<"Contribution">;
}

export const abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Contribution",
    type: "event",
  },
  { inputs: [], name: "contribute", outputs: [], stateMutability: "payable", type: "function" },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "contributions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "retrieve", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [],
    name: "total",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export class Playground extends TypedContract<PlaygroundEvents, PlaygroundFilters> {
  // Calls
  contributions!: (arg: string, overrides?: CallOverrides) => Promise<BigNumber>;
  total!: (overrides?: CallOverrides) => Promise<BigNumber>;

  // Methods
  contribute!: (overrides?: PayableOverrides) => Promise<TransactionResponse>;
  retrieve!: (overrides?: Overrides) => Promise<TransactionResponse>;

  override filters!: PlaygroundFilters;

  constructor(signer?: Signer | Provider) {
    super(env.addresses.Playground, abi, signer);
  }
}
