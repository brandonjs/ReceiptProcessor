import { promises as fs, readFileSync } from 'fs';
import _ from 'lodash';

import { Receipt, ReceiptResult, Receipts } from '../interfaces';
import { Constants } from '../utils';

export class FileDB {
  public receipts: Receipts;

  constructor() {
    this.receipts = this.loadReceipts();
  }

  private loadReceipts(): Receipts {
    try {
      const data = readFileSync(Constants.RECEIPT_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log(`${error}`);
      return {};
    }
  }

  private async saveReceipts() {
    try {
      await fs.writeFile(
        Constants.RECEIPT_FILE,
        JSON.stringify(this.receipts),
        'utf-8',
      );
      console.log(`Receipts saved successfully!`);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  public async getReceipts(): Promise<Receipt[]> {
    return Object.values(this.receipts);
  }

  public async getReceipt(id: string): Promise<Receipt> {
    return new Receipt(this.receipts[id]);
  }

  public async saveReceipt(receipt: Receipt): Promise<ReceiptResult | null> {
    if (receipt.id in this.receipts) {
      return await this.updateReceipt(receipt.id, receipt);
    }

    this.receipts[receipt.id] = receipt;

    await this.saveReceipts();
    return { id: receipt.id };
  }

  public async updateReceipt(
    id: string,
    updated: Partial<Receipt>,
  ): Promise<ReceiptResult | null> {
    const existing = await this.getReceipt(id);
    if (!existing) {
      return null;
    }

    this.receipts[id] = _.merge(existing, updated);
    await this.saveReceipts();
    return { id: id };
  }

  public async deleteReceipt(id: string): Promise<null | void> {
    const receipt = await this.getReceipt(id);
    if (!receipt) {
      return null;
    }

    delete this.receipts[id];
    await this.saveReceipts();
  }
}
