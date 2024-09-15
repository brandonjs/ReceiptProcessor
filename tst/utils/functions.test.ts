import 'jest';

import { Receipt } from '../../src/interfaces';

describe('generate points test', () => {
  test('calculate points from target-receipt', async () => {
    const json = require('../resources/target-receipt.json');
    const receipt = new Receipt(json);
    expect(await receipt.calculatePoints()).toBe(28);
  });

  test('calculate points from mm-receipt', async () => {
    const json = require('../resources/mm-receipt.json');
    const receipt = new Receipt(json);
    expect(await receipt.calculatePoints()).toBe(109);
  });

  test('calculate points from morning-receipt', async () => {
    const json = require('../resources/morning-receipt.json');
    const receipt = new Receipt(json);
    expect(await receipt.calculatePoints()).toBe(15);
  });

  test('calculate points from simple-receipt', async () => {
    const json = require('../resources/simple-receipt.json');
    const receipt = new Receipt(json);
    expect(await receipt.calculatePoints()).toBe(31);
  });
});
