import * as express from 'express';
import { Request } from 'express';
import { blockListener } from './app/block';
import { etherscanApi, EtherscanParams } from './app/etherscan';

const server = express();


server.get('/etherscan/**', async (req: Request<EtherscanParams>, res) => {
  try {
    const result = await etherscanApi(req.params);
    res.send({ status: '1', message: 'OK', result});
  } catch(err) {
    res.sendStatus(400);
  }
});

const port = process.env['PORT'] || 3333;
server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
  blockListener();
});