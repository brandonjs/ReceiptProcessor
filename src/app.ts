import 'dotenv/config';
import express from 'express';

import { Constants } from './utils';
import { ReceiptsRouter } from './routes/receipts';

export class ReceiptsApp {
  /**
   * @description The PORT to run the server on.
   */
  readonly port: number = Constants.PORT;

  /**
   * @description The express app.
   */
  readonly app = express();

  constructor() {
    if (process.env.PORT) {
      console.log(`Custom port value specified...`);
      this.port = parseInt(process.env.PORT as string, 10);
    }
  }

  /**
   * @description Sets up the express app and runs it on the provided port..
   */
  run() {
    // Process all data sent in post as JSON.
    this.app.use(express.json({ type: '*/*' }));

    // Add the receipt processor on /receipts.
    this.app.use(Constants.RECEIPTS_PATH, new ReceiptsRouter().router);

    this.app.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
}

const app = new ReceiptsApp();
app.run();
