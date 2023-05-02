import * as express from 'express';
import * as cors from 'cors';
import { Request } from 'express';
import { blockListener } from './app/block';
import { etherscanApi, EtherscanParams } from './app/etherscan';
import { createServer } from "http";
import { Server } from "socket.io";

const explorerAppPort = process.env['EXPLORER_APP_PORT'] || 3001;
const explorerApiPort = process.env['EXPLORER_API_PORT'] || 3000;

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:${explorerAppPort}`,
    credentials: true
  }
});

///////////////
// ETHERSCAN //
///////////////
app.get('/etherscan', async (req: Request<unknown, unknown, unknown, EtherscanParams>, res) => {
  try {
    const result = await etherscanApi(req.query);
    res.send({ status: '1', message: 'OK', result});
  } catch(err) {
    res.status(400).send(err);
  }
});
app.post('/etherscan', async (req: Request<unknown, unknown, EtherscanParams>, res) => {
  try {
    const result = await etherscanApi(req.body);
    res.send({ status: '1', message: 'OK', result});
  } catch(err) {
    res.status(400).send(err);
  }
});


httpServer.listen(explorerApiPort);

const { addSocket } = blockListener();
io.on("connection", (socket) => addSocket(socket));
