// See: https://gitter.im/ethereum/remix-dev?at=62bdb8fc8fe56a38b5ef4419
import { ABIDescription } from '@type/solc';
type LinkReferences = {
  [contractName: string]: {
    [library: string]: { start: number; length: number }[]
  }
}
interface Scenario {
  account: Record<string, string>;
  linkReferences: LinkReferences;
  abi: Record<string, ABIDescription[]>;
}

interface TransactionEvent {
  /** ms */
  timestamp: number;
  record: RecordTransaction;
}

interface RecordTransaction {
  from: string;
  value: string;
  parameters: string[];
  name: string;
  abi: string;
  inputs: `(${string})`;
}

interface ConstructorTransaction extends RecordTransaction {
  type: 'constructor';
  bytecode: string;
  contractName: string;
}

interface FunctionTransaction extends RecordTransaction {
  type: 'function';
  to: string;
}

interface FallbackTransaction extends RecordTransaction {
  type: 'fallback';
  to: string;
}