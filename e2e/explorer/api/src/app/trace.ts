import { Block } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber';
import { hexlify, hexZeroPad, hexStripZeros, arrayify } from '@ethersproject/bytes';
import { provider } from './provider';
import { StructLogs, Trace } from './types';

// TODO: implement tracer based on : https://github.com/zemse/hardhat-tracer/blob/master/src/trace/print-trace.ts#L166

export function parseHex(str: string) {
  return !str.startsWith('0x') ? '0x' + str : str;
}

export function parseNumber(str: string) {
  return parseUint(str).toNumber();
}

export function parseUint(str: string) {
  return BigNumber.from(parseHex(str));
}

export function parseAddress(str: string) {
  return hexZeroPad(hexStripZeros(parseHex(str)), 20);
}

export function parseMemory(strArr: string[]) {
  return arrayify(parseHex(strArr.join()));
}




async function getInternalTransactions(block: Block) {
  if (block.transactions.length) {
    const getTrace = block.transactions.map(hash => provider.send('debug_traceTransaction', [hash, { disableStorage: true }]))
    const traces: Trace[] = await Promise.all(getTrace);
    return traces.map(trace => {
      return trace.structLogs.map(log => {
        if (log.op === 'CREATE') {
          return;
        } else if (log.op === 'CREATE2') {
          return;
        } else if (log.op === 'CALL') {
          const stack = [...log.stack];
          const gas = parseUint(stack.pop());
          const to = parseAddress(stack.pop());
          const value = parseUint(stack.pop());
          const argsOffset = parseNumber(stack.pop());
          const argsSize = parseNumber(stack.pop());
          const retOffset = parseNumber(stack.pop());
          const retSize = parseNumber(stack.pop());
          const memory = parseMemory(log.memory);
          const input = hexlify(memory.slice(argsOffset, argsOffset + argsSize));
          return {
            blockNumber: block.number,
            timeStamp: block.timestamp,
            from: '', // Todo
            to,
            value,
            contractAddress: "", // todo
            input,
            type: 'call',
            gas,
            gasUsed: gas,
            isError:0,
            errCode: ''
          }
        }
      }).filter(v => !!v);
    })
  }

}