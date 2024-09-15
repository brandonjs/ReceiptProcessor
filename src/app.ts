import 'dotenv/config';
import express from 'express';

import { Constants } from './utils';
import { ReceiptsRouter } from './routes/receipts';

export class ReceiptsApp {
  readonly port: number = Constants.PORT;
  readonly app = express();

  constructor() {
    if (process.env.PORT) {
      console.log(`Custom port value specified...`);
      this.port = parseInt(process.env.PORT as string, 10);
    }
  }

  run() {
    this.app.use(express.json({ type: '*/*' }));
    this.app.use('/receipts', new ReceiptsRouter().router);

    this.app.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
}

const app = new ReceiptsApp();
app.run();
