import { getAddress } from "@ethersproject/address";
import { Socket } from 'socket.io';
import { promises as fs } from "fs";
import { join } from "path";
import { provider } from "./provider";
import { setBlock, store, setArtifact, setBalance } from "./store";


//////////
// INIT //
//////////
const hardhatAccounts = [
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
  '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
  '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
  '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
  '0x976ea74026e726554db657fa54763abd0c3a0aa9',
  '0x14dc79964da2c08b23698b3d3cc7ca32193d9955',
  '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f',
  '0xa0ee7a142d267c1f36714e4a8f75612f20a79720',
].map(getAddress);

async function initFactories(root: string) {
  const folders = await fs.readdir(root);
  for (const folder of folders) {
    const files = await fs.readdir(join(root, folder));
    for (const file of files) {
      const path = join(root, folder, file);
      if (path.endsWith('.dbg.json')) continue;
      if (path.endsWith('.json')) {
        const res = await fs.readFile(path, 'utf8');
        const arfitact = JSON.parse(res);
        setArtifact(arfitact);
      }
    }
  }
}

async function init() {
  // Only use cwd for local development
  const artifactRoot = process.env['ARTIFACTS_ROOT'] ?? join(process.cwd(), 'e2e/explorer/hardhat/artifacts/src');
  await initFactories(artifactRoot);
  const current = await provider.getBlockNumber();
  for (let i = 0; i <= current; i++) {
    const block = await provider.getBlock(i);
    await setBlock(block);
  }
  for (const address of hardhatAccounts) {
    setBalance({ address, isContract: false });
  }
}


////////////////////
// BLOCK LISTENER //
////////////////////

export function blockListener() {
  const sockets: Record<string, Socket> = {};
  const emit = () => {
    Object.values(sockets).forEach(socket => socket.emit('block', store));
  }

  // Start Listening on the node
  console.log('Start listening on Ethereum Network');


  // Initialize the state
  const initialized = init().then(() => emit());

  let lastBlock: number;
  // Listen on block changes (Hardh hat doesn't support pending transaction event)
  provider.on('block', async (blockNumber: number) => {
    if (lastBlock === blockNumber) return; // For some reason the callback is triggered 4times
    lastBlock = blockNumber;
    await initialized;
    const block = await provider.getBlock(blockNumber);
    await setBlock(block);
    emit();
  });


  // Add a socket when a client connect to it
  return {
    addSocket(socket: Socket) {
      sockets[socket.id] = socket;
      emit();
    }
  }
}