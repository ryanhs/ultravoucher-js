const noop = require('noop-logger');
const { Client } = require('../lib/index');

noop.trace = noop.debug;

describe('check balance', () => {
  it('get balance without error', async () => {
    const client = new Client({
      appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
      appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
      apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
      logger: noop,
    });

    const request = client.getBalance();
    await expect(request).resolves.not.toThrow();
    
    // balance > 0 *NEEDED FOR OTHER TEST
    await expect(request).resolves.toBeGreaterThan(0);
  });
});
