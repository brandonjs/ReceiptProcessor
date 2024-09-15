export class Constants {

  /* The port for the app to listen on. */
  public static readonly PORT: number = 8080;

  /* The location of the file for the DB to use. */
  public static readonly RECEIPT_FILE: string = '../receipts.json';

  /* The URL path of the receipts processor */
  public static readonly RECEIPTS_PATH: string = '/receipts';

  /* The URL path to process/upload receipts */
  public static readonly PROCESS_PATH: string = '/process';

  /* The URL path to get the points of a receipt. */
  public static readonly POINTS_PATH: string = '/:id/points';
}
