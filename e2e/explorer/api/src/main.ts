import * as express from 'express';
import { Request } from 'express';
import { blockListener } from './app/block';
import { etherscanApi, EtherscanParams } from './app/etherscan';
import { createServer } from "http";
import { Server } from "socket.io";
import { setArtifact } from './app/artifacts';

const explorerAppPort = process.env['EXPLORER_APP_PORT'] || 4200;
const explorerApiPort = process.env['EXPLORER_API_PORT'] || 3333;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:${explorerAppPort}`
  }
});

app.post('/artifacts', (req, res) => setArtifact(req.body));

app.get('/etherscan/**', async (req: Request<EtherscanParams>, res) => {
  try {
    const result = await etherscanApi(req.params);
    res.send({ status: '1', message: 'OK', result});
  } catch(err) {
    res.sendStatus(400);
  }
});


httpServer.listen(explorerApiPort);

const { addSocket } = blockListener();
io.on("connection", (socket) => {
  console.log('CONNECTED', socket.id)
  addSocket(socket);
});
