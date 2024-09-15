import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FileDB } from '../db/file_db.ts';
import { Receipt } from '../interfaces';

export class ReceiptsRouter {
  public readonly router: Router;
  private readonly db: FileDB;

  constructor() {
    this.router = express.Router();
    this.addProcessRoute();
    this.addPointsRoute();
    this.db = new FileDB();
  }

  private addProcessRoute() {
    this.router.post('/process', async (req: Request, res: Response) => {
      try {
        const receipt: Receipt = new Receipt(req.body);
        if (!(await receipt.isValid(receipt))) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: 'Provided receipt is invalid. Please check all parameters and try again.' });
        }
        const result = await this.db.saveReceipt(receipt);
        return res
          .setHeader('Content-Type', 'application/json')
          .status(StatusCodes.CREATED)
          .json(result);
      } catch (error) {
        return res
          .setHeader('Content-Type', 'application/json')
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error });
      }
    });
  }

  private addPointsRoute() {
    this.router.get('/:id/points', async (req: Request, res: Response) => {
      try {
        const receipt = await this.db.getReceipt(req.params.id);
        if (receipt === null) {
          console.log(`Receipt not found with id: ${req.params.id}`);
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Receipt not found.' });
        }

        const points = await receipt.calculatePoints();
        return res
          .setHeader('Content-Type', 'application/json')
          .status(StatusCodes.OK)
          .json({ points: points.valueOf() });
      } catch (error) {
        return res
          .setHeader('Content-Type', 'application/json')
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error });
      }
    });
  }
}
