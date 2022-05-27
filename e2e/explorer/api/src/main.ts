import * as express from 'express';
import { Request } from 'express';
import { blockListener } from './app/block';
import { etherscanApi, EtherscanParams } from './app/etherscan';
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200"
  }
});

app.get('/etherscan/**', async (req: Request<EtherscanParams>, res) => {
  try {
    const result = await etherscanApi(req.params);
    res.send({ status: '1', message: 'OK', result});
  } catch(err) {
    res.sendStatus(400);
  }
});

const port = process.env['PORT'] || 3333;
httpServer.listen(port);

const { addSocket } = blockListener();
io.on("connection", (socket) => {
  console.log('CONNECTED', socket.id)
  addSocket(socket);
});
