const noop = require('noop-logger');
const { Client } = require('../lib/index');

noop.trace = noop.debug;

describe('brand list', () => {
  it('get brand list without error', async () => {
    const client = new Client({
      appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
      appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
      apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
      logger: noop,
    });

    const request = client.getBrandList();
    await expect(request).resolves.not.toThrow();
    await expect(request).resolves.toEqual(expect.arrayContaining([]));
  });

});
