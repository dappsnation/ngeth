import { BigNumber, CallOverrides, ContractFunction, logger, PopulatedTransaction, Signer } from "ethers";
import { Provider, TransactionResponse } from '@ethersproject/providers';
import { accessListify, arrayify, FunctionFragment, getAddress, Logger, ParamType, resolveProperties } from "ethers/lib/utils";

import type { NgContract } from "./contract";

export async function resolveName(resolver: Signer | Provider, nameOrPromise: string | Promise<string>): Promise<string> {
  const name = await nameOrPromise;

  if (typeof(name) !== "string") {
    throw new Error(`invalid address or ENS name: ${name}`);
  }

  // If it is already an address, just use it (after adding checksum)
  try {
    return getAddress(name);
  } catch (error) {
    // do nothing
  }

  if (!resolver) {
    throw new Error("a provider or signer is needed to resolve ENS names");
  }

  const address = await resolver.resolveName(name);

  if (address == null) {
    throw new Error(`resolver or addr is not configured for ENS name: ${name}`);
  }

  return address;
}

// Recursively replaces ENS names with promises to resolve the name and resolves all properties
export async function resolveAddresses(resolver: Signer | Provider, value: any, paramType: ParamType | ParamType[]): Promise<any> {
  if (Array.isArray(paramType)) {
    return await Promise.all(paramType.map((paramType, index) => {
      return resolveAddresses(
        resolver,
        ((Array.isArray(value)) ? value[index]: value[paramType.name]),
        paramType
      );
    }));
  }

  if (paramType.type === "address") {
      return await resolveName(resolver, value);
  }

  if (paramType.type === "tuple") {
      return await resolveAddresses(resolver, value, paramType.components);
  }

  if (paramType.baseType === "array") {
    if (!Array.isArray(value)) {
      return Promise.reject(`invalid value for array: ${JSON.stringify(value)}`);
    }
    return await Promise.all(value.map((v) => resolveAddresses(resolver, v, paramType.arrayChildren)));
  }

  return value;
}





export async function populateTransaction(contract: NgContract, fragment: FunctionFragment, args: Array<any>): Promise<PopulatedTransaction> {
  // If an extra argument is given, it is overrides
  let overrides: CallOverrides = { };
  if (args.length === fragment.inputs.length + 1 && typeof(args[args.length - 1]) === "object") {
      overrides = { ...args.pop() };
  }

  // Make sure the parameter count matches
  logger.checkArgumentCount(args.length, fragment.inputs.length, "passed to contract");

  // Populate "from" override (allow promises)
  if (contract.signer) {
      if (overrides.from) {
          // Contracts with a Signer are from the Signer's frame-of-reference;
          // but we allow overriding "from" if it matches the signer
          overrides.from = resolveProperties({
              override: resolveName(contract.signer, overrides.from),
              signer: contract.signer.getAddress()
          }).then(async (check) => {
              if (getAddress(check.signer) !== check.override) {
                  logger.throwError("Contract with a Signer cannot override from", Logger.errors.UNSUPPORTED_OPERATION, {
                      operation: "overrides.from"
                  });
              }

              return check.override;
          });

      } else {
          overrides.from = contract.signer.getAddress();
      }

  } else if (overrides.from && contract.provider) {
      overrides.from = resolveName(contract.provider, overrides.from);

  //} else {
      // Contracts without a signer can override "from", and if
      // unspecified the zero address is used
      //overrides.from = AddressZero;
  }
  const signerOrProvider = contract.signer || contract.provider;
  if (!signerOrProvider) throw new Error('Provider is required to populateTransaction');

  // Wait for all dependencies to be resolved (prefer the signer over the provider)
  const resolved = await resolveProperties({
    args: resolveAddresses(signerOrProvider, args, fragment.inputs),
    address: contract.resolvedAddress,
    overrides: (resolveProperties(overrides) || { })
  });

  // The ABI coded transaction
  const data = contract.interface.encodeFunctionData(fragment, resolved.args);
  const tx: PopulatedTransaction = {
    data: data,
    to: resolved.address
  };

  // Resolved Overrides
  const ro = resolved.overrides as Partial<PopulatedTransaction>;

  // Populate simple overrides
  if (ro.nonce != null) { tx.nonce = BigNumber.from(ro.nonce).toNumber(); }
  if (ro.gasLimit != null) { tx.gasLimit = BigNumber.from(ro.gasLimit); }
  if (ro.gasPrice != null) { tx.gasPrice = BigNumber.from(ro.gasPrice); }
  if (ro.maxFeePerGas != null) { tx.maxFeePerGas = BigNumber.from(ro.maxFeePerGas); }
  if (ro.maxPriorityFeePerGas != null) { tx.maxPriorityFeePerGas = BigNumber.from(ro.maxPriorityFeePerGas); }
  if (ro.from != null) { tx.from = ro.from; }

  if (ro.type != null) { tx.type = ro.type; }
  if (ro.accessList != null) { tx.accessList = accessListify(ro.accessList); }

  // If there was no "gasLimit" override, but the ABI specifies a default, use it
  if (tx.gasLimit == null && fragment.gas != null) {
      // Compute the intrinsic gas cost for this transaction
      // @TODO: This is based on the yellow paper as of Petersburg; this is something
      // we may wish to parameterize in v6 as part of the Network object. Since this
      // is always a non-nil to address, we can ignore G_create, but may wish to add
      // similar logic to the ContractFactory.
      let intrinsic = 21000;
      const bytes = arrayify(data);
      for (let i = 0; i < bytes.length; i++) {
          intrinsic += 4;
          if (bytes[i]) { intrinsic += 64; }
      }
      tx.gasLimit = BigNumber.from(fragment.gas).add(intrinsic);
  }

  // Populate "value" override
  if (ro.value) {
      const roValue = BigNumber.from(ro.value);
      if (!roValue.isZero() && !fragment.payable) {
          throw new Error(`non-payable method cannot override value: ${JSON.stringify(overrides.value)}`);
      }
      tx.value = roValue;
  }

  if (ro.customData) tx.customData = { ...ro.customData };

  // Remove the overrides
  delete overrides.nonce;
  delete overrides.gasLimit;
  delete overrides.gasPrice;
  delete overrides.from;
  delete overrides.value;

  delete overrides.type;
  delete overrides.accessList;

  delete overrides.maxFeePerGas;
  delete overrides.maxPriorityFeePerGas;

  delete overrides.customData;

  // Make sure there are no stray overrides, which may indicate a
  // typo or using an unsupported key.
  const leftovers = Object.keys(overrides).filter((key) => ((<any>overrides)[key] != null));
  if (leftovers.length) {
      logger.throwError(`cannot override ${ leftovers.map((l) => JSON.stringify(l)).join(",") }`, Logger.errors.UNSUPPORTED_OPERATION, {
          operation: "overrides",
          overrides: leftovers
      });
  }

  return tx;
}


// function addContractWait(contract: NgContract, tx: TransactionResponse) {
//   const wait = tx.wait.bind(tx);
//   tx.wait = (confirmations?: number) => {
//     return wait(confirmations).then((receipt: ContractReceipt) => {
//       receipt.events = receipt.logs.map((log) => {
//         const event: Event = deepCopy(log) as Event;
//         let parsed: LogDescription = null;
//         try {
//           parsed = contract.interface.parseLog(log);
//         } catch (e){ /** */ }

//         // Successfully parsed the event log; include it
//         if (parsed) {
//           event.args = parsed.args;
//           event.decode = (data: BytesLike, topics?: Array<any>) => {
//               return contract.interface.decodeEventLog(parsed.eventFragment, data, topics);
//           };
//           event.event = parsed.name;
//           event.eventSignature = parsed.signature;
//         }

//         // Useful operations
//         event.removeListener = () => contract.provider;
//         event.getBlock = () => contract.provider.getBlock(receipt.blockHash);
//         event.getTransaction = () => contract.provider.getTransaction(receipt.transactionHash);
//         event.getTransactionReceipt = () => Promise.resolve(receipt);

//         return event;
//       });

//       return receipt;
//     });
//   };
// }



export function buildCall(contract: NgContract, fragment: FunctionFragment): ContractFunction {
  
  return async function(...args: Array<any>): Promise<any> {
    const signerOrProvider = (contract.signer || contract.provider);
    if (!signerOrProvider) throw new Error('Provider required to make a call');
    // Extract the "blockTag" override if present
    let blockTag = undefined;
    if (args.length === fragment.inputs.length + 1 && typeof(args[args.length - 1]) === "object") {
      const overrides = { ...args.pop() };
      if (overrides.blockTag != null) {
        blockTag = await overrides.blockTag;
      }
      delete overrides.blockTag;
      args.push(overrides);
    }

    // If the contract was just deployed, wait until it is mined
    if (contract.deployTransaction != null) {
      await contract.deployed(blockTag);
    }

    // Call a node and get the result
    const tx = await populateTransaction(contract, fragment, args);
    const result = await signerOrProvider.call(tx, blockTag);

    console.log({tx, result, fragment});
    let value = contract.interface.decodeFunctionResult(fragment, result);
    if (fragment.outputs?.length === 1) {
      value = value[0];
    }
    return value;
  };
}

export function buildSend(contract: NgContract, fragment: FunctionFragment): ContractFunction<TransactionResponse> {
  return async function(...args: Array<any>): Promise<TransactionResponse> {
    if (!contract.signer) {
        logger.throwError("sending a transaction requires a signer", Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "sendTransaction"
        })
    }

    // If the contract was just deployed, wait until it is mined
    if (contract.deployTransaction != null) {
      await contract.deployed();
    }

    const txRequest = await populateTransaction(contract, fragment, args);

    const tx = await contract.signer.sendTransaction(txRequest);

    // TODO: Tweak the tx.wait so the receipt has extra properties
    // addContractWait(contract, tx);

    return tx;
  };
}

export function buildDefault(contract: NgContract, fragment: FunctionFragment): ContractFunction {
  if (fragment.constant) {
    return buildCall(contract, fragment);
  }
  return buildSend(contract, fragment);
}