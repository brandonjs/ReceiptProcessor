import { createHash } from 'crypto';

export class Receipt {
  /**
   * @description The name of the retailer or store the receipt is from.
   * @example M&M Corner Market
   */
  readonly retailer: string = '';
  /**
   * Format: date
   * @description The date of the purchase printed on the receipt.
   * @example 2022-01-01
   */
  readonly purchaseDate: string = '1970-01-01';
  /**
   * Format: time
   * @description The time of the purchase printed on the receipt. 24-hour time expected.
   * @example 13:01
   */
  readonly purchaseTime: string = '0:00';

  /**
   * Format: Date
   * @description a Date object representing the purchaseDate and Time.
   */
  readonly purchaseDateTime: Date;

  /**
   * @description The list of items purchased on the receipt.
   */
  readonly items: Item[] = [];

  /**
   * @description The total amount paid on the receipt.
   * @example 6.49
   */
  readonly total: number = 0;

  /**
   * @description Unique identifier for this receipt.
   */
  readonly id: string;

  constructor(data: Object) {
    Object.assign(this, data);
    this.purchaseDateTime = this.setPurchaseDateTime();
    this.id = this.generateId();
  }

  /**
   * @private
   * @description Sets a Date object from the provided date and time for easier parsing.
   * @return Date object representing the date/time of the receipt.
   */
  private setPurchaseDateTime(): Date {
    return new Date(
      `${this.purchaseDate.replace('/', '-')}T${this.purchaseTime}`,
    );
  }

  /**
   * @private
   * @description Uses the crypto library to generate a unique hash of the receipt.
   * @return string containing the hash of the receipt.
   */
  private generateId(): string {
    const stringToHash = `${this.retailer}${this.purchaseDateTime.toString()}${this.total.toString()}`;
    return createHash('sha256').update(stringToHash).digest('hex');
  }

  /**
   * @description Function to determine if this receipt is valid.
   * @return whether the receipt is valid.
   */
  public async isValid(): Promise<boolean> {
    return !(
      !this.purchaseDateTime ||
      this.retailer.length == 0 ||
      this.total == 0
    );
  }

  /**
   * @description Calculates the points of the receipt.
   * @return The total number of points the receipt is worth.
   */
  public async calculatePoints(): Promise<number> {
    let calculated = 0;

    // One point for every alphanumeric character in the retailer name.
    calculated += this.retailer.replace(/\W/g, '').length;

    // 50 points if the total is a round dollar amount with no cents.
    calculated += this.total % 1 === 0 ? 50 : 0;

    // 25 points if the total is a multiple of 0.25.
    calculated += this.total % 0.25 == 0 ? 25 : 0;

    // 5 points for every two items on the receipt.
    calculated += 5 * Math.floor(this.items.length / 2);

    // 6 points if the day in the purchase date is odd.
    calculated += this.purchaseDateTime.getDate() % 2 == 1 ? 6 : 0;

    // If the trimmed length of the item description is a multiple of 3,
    // multiply the price by 0.2 and round up to the nearest integer.
    // The result is the number of points earned.
    calculated += this.items.reduce(
      (sum, item) =>
        item.shortDescription.trim().length % 3 == 0
          ? sum + Math.ceil(item.price * 0.2)
          : sum,
      0,
    );

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm
    calculated +=
      this.purchaseDateTime.getHours() < 16 &&
      this.purchaseDateTime.getHours() >= 14
        ? 10
        : 0;
    return calculated;
  }
}

export interface Item {
  /**
   * @description The Short Product Description for the item.
   * @example Mountain Dew 12PK
   */
  shortDescription: string;
  /**
   * @description The total price paid for this item.
   * @example 6.49
   */
  price: number;
}

/**
 * @description A result item returned when a receipt is processed.
 * @return JSON object containing the crested receipt's ID.
 */
export interface ReceiptResult {
  id: string;
}

/** Object containing receipt by id. */
export type Receipts = Record<string, Receipt>;
