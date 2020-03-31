const noop = require('noop-logger');
const { Client } = require('../lib/index');

noop.trace = noop.debug;

describe('check token', () => {
  it('get access token', async () => {
    const client = new Client({
      appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
      appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
      apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
      logger: noop,
    });

    await expect(client.getToken())
      .resolves
      .not
      .toThrow();
  });

});
