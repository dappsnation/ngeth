type bytes = '8' | '16' | '32' | '64' | '128' | '256';

type ABISingleTypeParameter = 
| 'string'
| 'uint'
| 'int'
| 'address'
| 'bool'
| 'fixed'
| `fixed${bytes}`
| 'ufixed'
| `ufixed${bytes}`
| 'bytes'
| `bytes${bytes}`
| 'function'
| 'tuple';

type ABIArrayType<T extends string> = `${T}[]` | `${T}[${number}]`;

export type ABITypeParameter = ABISingleTypeParameter | ABIArrayType<ABISingleTypeParameter>;


export interface ABIParameter {
  /** The name of the parameter */
  name: string;
  /** The canonical type of the parameter */
  type: ABITypeParameter;
  /** Used for tuple types */
  components?: ABIParameter[];
  /**
   * @example "struct StructName"
   * @example "struct Contract.StructName"
   */
  internalType?: string;
}

interface ABIEventParameter extends ABIParameter {
  /** true if the field is part of the log’s topics, false if it one of the log’s data segment. */
  indexed: boolean;
}

export interface FunctionDescription {
  /** Type of the method. default is 'function' */
  type?: 'function' | 'constructor' | 'fallback' | 'receive';
  /** The name of the function. Constructor and fallback functions never have a name */
  name?: string;
  /** List of parameters of the method. Fallback functions don’t have inputs. */
  inputs?: ABIParameter[];
  /** List of the output parameters for the method, if any */
  outputs?: ABIParameter[];
  /** State mutability of the method */
  stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
  /** true if function accepts Ether, false otherwise. Default is false */
  payable?: boolean;
  /** true if function is either pure or view, false otherwise. Default is false  */
  constant?: boolean;
}

export interface EventDescription {
  type: 'event';
  name: string;
  inputs: ABIEventParameter[];
  /** true if the event was declared as anonymous. */
  anonymous: boolean;
}

export interface ErrorDescription {
  type: 'error';
  name: string;
  inputs: ABIEventParameter[];
}

export type ABIDescription = FunctionDescription | EventDescription | ErrorDescription;
