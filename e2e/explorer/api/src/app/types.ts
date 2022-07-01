// See: https://github.dev/NomicFoundation/hardhat/blob/master/packages/hardhat-core/src/internal/hardhat-network/provider/output.ts#L129
export interface Trace {
  gas: number;
  failed: boolean;
  returnValue: string;
  structLogs: StructLogs[];
}

export interface StructLogs {
  pc: number;
  op: OpCode;
  gas: number;
  gasCost: number;
  depth: number;
  stack: string[];
  memory: string[];
  storage: Record<string, unknown>;
}

type OpDup = `DUP${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16}`;
type OpSwap = `SWAP${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16}`;
type OpLog = `SWAP${1 | 2 | 3 | 4}`;
type OpPush = `PUSH${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32}`;
type OpCode = 'STOP' | 'ADD' | 'MUL' | 'SUB' | 'DIV' | 'SDIV' | 'MOD' | 'SMOD' | 'ADDMOD' | 'MULMOD' | 'EXP' | 'SIGNEXTEND' | 'LT' | 'GT' | 'SLT' | 'SGT' | 'EQ' | 'ISZERO' | 'AND' | 'OR' | 'XOR' | 'NOT' | 'BYTE' | 'SHA3' | 'ADDRESS' | 'BALANCE' | 'ORIGIN' | 'CALLER' | 'CALLVALUE' | 'CALLDATALOAD' | 'CALLDATASIZE' | 'CALLDATACOPY' | 'CODESIZE' | 'CODECOPY' | 'GASPRICE' | 'EXTCODESIZE' | 'EXTCODECOPY' | 'BLOCKHASH' | 'COINBASE' | 'TIMESTAMP' | 'NUMBER' | 'DIFFICULTY' | 'GASLIMIT' | 'POP' | 'MLOAD' | 'MSTORE' | 'MSTORE8' | 'SLOAD' | 'SSTORE' | 'JUMP' | 'JUMPI' | 'PC' | 'MSIZE' | 'GAS' | 'JUMPDEST' | OpPush | OpDup | OpSwap | OpLog | 'CREATE' | 'CALL' | 'CALLCODE' | 'RETURN' | 'INVALID' | 'SELFDESTRUCT' | 'DELEGATECALL' | 'RETURNDATASIZE' | 'RETURNDATACOPY' | 'STATICCALL' | 'REVERT' | 'SHL' | 'SHR' | 'SAR' | 'EXTCODEHASH' | 'CREATE2' | 'CHAINID' | 'SELFBALANCE' | 'TLOAD' | 'TSTORE' | 'BEGINSUB' | 'RETURNSUB' | 'JUMPSUB' | 'BASEFEE' | 'PUSH0' | 'AUTH' | 'AUTHCALL';