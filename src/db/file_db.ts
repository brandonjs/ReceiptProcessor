import { promises as fs, readFileSync } from 'fs';
import _ from 'lodash';

import { Receipt, ReceiptResult, Receipts } from '../interfaces';
import { Constants } from '../utils';

/**
 * Basic File DB class.
 */
export class FileDB {
  public receipts: Receipts;

  constructor() {
    this.receipts = this.loadReceipts();
  }

  /**
   * @private
   * @description Loads the saved receipts from the RECEIPT_FILE.
   * @return JSON object representation of all the saved receipts.
   */
  private loadReceipts(): Receipts {
    try {
      const data = readFileSync(Constants.RECEIPT_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log(`${error}`);
      return {};
    }
  }

  /**
   * @private
   * @description Saves the receipts object to the RECEIPT_FILE on disk.
   */
  private async saveReceipts() {
    try {
      await fs.writeFile(
        Constants.RECEIPT_FILE,
        JSON.stringify(this.receipts),
        'utf-8',
      );
      console.log(`Receipt saved successfully!`);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  /**
   * @description Gets all receipts from the Receipts object.
   */
  public async getReceipts(): Promise<Receipt[]> {
    return Object.values(this.receipts);
  }

  /**
   * @description Gets a single receipt from the DB.
   * @param id the identifier of the receipt to get.
   */
  public async getReceipt(id: string): Promise<Receipt> {
    return new Receipt(this.receipts[id]);
  }

  /**
   * @description Saves a single receipt to the DB.  Updates an existing receipt if the receipt
   * is already present in the receipt object.
   * @param receipt
   * @return Receipt object of the found receipt.
   */
  public async saveReceipt(receipt: Receipt): Promise<ReceiptResult | null> {
    if (receipt.id in this.receipts) {
      return await this.updateReceipt(receipt.id, receipt);
    }

    this.receipts[receipt.id] = receipt;
    await this.saveReceipts();
    return { id: receipt.id };
  }

  /**
   * @description Updates an existing receipt.
   * @param id The ID of the receipt to update.
   * @param updated A Partial<Receipt> object to update the current receipt with.
   */
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

  /**
   * @description Deletes a receipt.
   * @param id The ID of the receipt.to delete.
   */
  public async deleteReceipt(id: string): Promise<null | void> {
    const receipt = await this.getReceipt(id);
    if (!receipt) {
      return null;
    }

    delete this.receipts[id];
    await this.saveReceipts();
  }
}
