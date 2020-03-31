const noop = require('noop-logger');
const { Client } = require('../lib/index');

noop.trace = noop.debug;

describe('create client', () => {
  it('use defaults options without error', async () => {
    expect(new Client({
      appId: 'id1',
      appKey: 'key1',
      logger: noop,
    }))
      .toBeInstanceOf(Client);
  });

  it('throw error on options not provided properly', async () => {
    expect(() => new Client({
      appId: 'id1',
      logger: noop,
    }))
      .toThrow();

    expect(() => new Client({
      appKey: 'key1',
      logger: noop,
    }))
      .toThrow();
  });

  it('use custom logger', async () => {
    const mock = jest.fn();
    const logger = {
      info: mock,
      error: mock,
      warn: mock,
      trace: mock,
      debug: mock,
    };

    expect(new Client({
      appId: 'id1',
      appKey: 'key1',
      logger,
    }))
      .toBeInstanceOf(Client);

    expect(mock).toBeCalled();
  });

});
