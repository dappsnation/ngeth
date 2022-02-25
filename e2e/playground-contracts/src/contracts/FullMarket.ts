import { TypedContract, FilterParam, TypedFilter } from "./common";
import {
  BigNumber,
  Overrides,
  CallOverrides,
  PayableOverrides,
  Signer,
  ContractTransaction,
  BytesLike,
  BigNumberish,
} from "ethers";
import { Provider } from "@ethersproject/providers";
import env from "../../environments/environment";

export interface FullMarketEvents {
  events: {
    ERC1155AcceptOffer: (
      contractAddress: string,
      from: string,
      tokenId: BigNumberish,
      to: string,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike
    ) => void;
    ERC1155CancelOffer: (contractAddress: string, from: string, tokenId: BigNumberish) => void;
    ERC1155UpsertOffer: (
      contractAddress: string,
      from: string,
      tokenId: BigNumberish,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike
    ) => void;
    ERC721AcceptOffer: (
      contractAddress: string,
      from: string,
      tokenId: BigNumberish,
      to: string,
      price: BigNumberish
    ) => void;
    ERC721CancelOffer: (contractAddress: string, from: string, tokenId: BigNumberish) => void;
    ERC721CreateOffer: (contractAddress: string, from: string, tokenId: BigNumberish, price: BigNumberish) => void;
    ERC777AcceptOffer: (
      contractAddress: string,
      from: string,
      to: string,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike
    ) => void;
    ERC777CancelOffer: (contractAddress: string, from: string) => void;
    ERC777UpsertOffer: (
      contractAddress: string,
      from: string,
      amount: BigNumberish,
      price: BigNumberish,
      data: BytesLike
    ) => void;
  };
  filters: {
    ERC1155AcceptOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"ERC1155AcceptOffer">;
    ERC1155CancelOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"ERC1155CancelOffer">;
    ERC1155UpsertOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"ERC1155UpsertOffer">;
    ERC721AcceptOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"ERC721AcceptOffer">;
    ERC721CancelOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"ERC721CancelOffer">;
    ERC721CreateOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>,
      tokenId?: FilterParam<BigNumberish>
    ) => TypedFilter<"ERC721CreateOffer">;
    ERC777AcceptOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>,
      to?: FilterParam<string>
    ) => TypedFilter<"ERC777AcceptOffer">;
    ERC777CancelOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>
    ) => TypedFilter<"ERC777CancelOffer">;
    ERC777UpsertOffer: (
      contractAddress?: FilterParam<string>,
      from?: FilterParam<string>
    ) => TypedFilter<"ERC777UpsertOffer">;
  };
  queries: {
    ERC1155AcceptOffer: {
      contractAddress: string;
      from: string;
      tokenId: BigNumber;
      to: string;
      amount: BigNumber;
      price: BigNumber;
      data: BytesLike;
    };
    ERC1155CancelOffer: { contractAddress: string; from: string; tokenId: BigNumber };
    ERC1155UpsertOffer: {
      contractAddress: string;
      from: string;
      tokenId: BigNumber;
      amount: BigNumber;
      price: BigNumber;
      data: BytesLike;
    };
    ERC721AcceptOffer: { contractAddress: string; from: string; tokenId: BigNumber; to: string; price: BigNumber };
    ERC721CancelOffer: { contractAddress: string; from: string; tokenId: BigNumber };
    ERC721CreateOffer: { contractAddress: string; from: string; tokenId: BigNumber; price: BigNumber };
    ERC777AcceptOffer: {
      contractAddress: string;
      from: string;
      to: string;
      amount: BigNumber;
      price: BigNumber;
      data: BytesLike;
    };
    ERC777CancelOffer: { contractAddress: string; from: string };
    ERC777UpsertOffer: { contractAddress: string; from: string; amount: BigNumber; price: BigNumber; data: BytesLike };
  };
}

export const abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "ERC1155AcceptOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "ERC1155CancelOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "ERC1155UpsertOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "ERC721AcceptOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "ERC721CancelOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "ERC721CreateOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "ERC777AcceptOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
    ],
    name: "ERC777CancelOffer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "contractAddress", type: "address" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "price", type: "uint256" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "ERC777UpsertOffer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "address payable", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "erc1155AcceptOffer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "erc1155CancelOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "erc1155Offers",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "erc1155UpsertOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "erc721AcceptOffer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "erc721CancelOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "erc721CreateOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "erc721Offers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "address payable", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "erc777AcceptOffer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "contractAddress", type: "address" }],
    name: "erc777CancelOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "erc777Offers",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddress", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "erc777UpsertOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class FullMarket extends TypedContract<FullMarketEvents> {
  constructor(signer?: Signer | Provider) {
    super(env.addresses.FullMarket, abi, signer);
  }

  erc1155Offers(
    arg: string,
    arg: string,
    arg: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber, BytesLike]> {
    return this.functions["erc1155Offers"](...arguments);
  }
  erc721Offers(arg: string, arg: BigNumberish, overrides?: CallOverrides): Promise<BigNumber> {
    return this.functions["erc721Offers"](...arguments);
  }
  erc777Offers(arg: string, arg: string, overrides?: CallOverrides): Promise<[BigNumber, BigNumber, BytesLike]> {
    return this.functions["erc777Offers"](...arguments);
  }

  erc1155AcceptOffer(
    contractAddress: string,
    from: string,
    to: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction> {
    return this.functions["erc1155AcceptOffer"](...arguments);
  }
  erc1155CancelOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    return this.functions["erc1155CancelOffer"](...arguments);
  }
  erc1155UpsertOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    price: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    return this.functions["erc1155UpsertOffer"](...arguments);
  }
  erc721AcceptOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    to: string,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction> {
    return this.functions["erc721AcceptOffer"](...arguments);
  }
  erc721CancelOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    return this.functions["erc721CancelOffer"](...arguments);
  }
  erc721CreateOffer(
    contractAddress: string,
    tokenId: BigNumberish,
    price: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    return this.functions["erc721CreateOffer"](...arguments);
  }
  erc777AcceptOffer(
    contractAddress: string,
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: PayableOverrides
  ): Promise<ContractTransaction> {
    return this.functions["erc777AcceptOffer"](...arguments);
  }
  erc777CancelOffer(contractAddress: string, overrides?: Overrides): Promise<ContractTransaction> {
    return this.functions["erc777CancelOffer"](...arguments);
  }
  erc777UpsertOffer(
    contractAddress: string,
    amount: BigNumberish,
    price: BigNumberish,
    data: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    return this.functions["erc777UpsertOffer"](...arguments);
  }
}
