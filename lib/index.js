const superagent = require('superagent');
const cacheManager = require('cache-manager');
const Signature = require('./signature');

// defaults
const defaultOptions = {
  appKey: null,
  appId: null,
  apiBaseUrl: 'https://microservice.vouchercenter.id/',
  logger: console,
  agent: superagent.agent(),
  cacher: cacheManager.caching({ store: 'memory', max: 100 }),
};

class Client {
  constructor(options = {}) {
    this.options = { ...defaultOptions, ...options };
    if (!this.options.appKey || !this.options.appId) {
      throw new Error('need appKey or appId');
    }

    // make it fast
    const logInfo = {
      lib: 'ultravoucher',
      appId: this.options.appId,
      apiBaseUrl: this.options.apiBaseUrl,
    };

    this.logger = this.options.logger.child
      ? this.options.logger.child(logInfo)
      : this.options.logger;
    this.agent = this.options.agent;
    this.cacher = this.options.cacher;

    this.logger.trace('client initialized');
  }

  responseNormalizer(responseOrError) {
    let { body } = responseOrError;

    // default
    let code = 'ERR001';

    // response code error?
    const { ok, timeout, error } = responseOrError;
    if (!ok || timeout || error) {
      body = responseOrError.response.body;
    }

    // any proper response ?
    if (body && typeof body === 'object' && body.code) {
      code = body.code;
    }

    const codes = {
      BAE001: 'Insufficient Balance',
      CLE001: 'appID or appKey missmatch',
      CLE002: 'Incomplete Request Data',
      CLN001: 'Client empty/ not active /id_client didn’t match',
      CLN002: 'Client Not Distributor',
      ERR001: 'Undefined Error',
      ERR002: 'Cant connect to core',
      ERR003: 'Empty Error Response',
      ODA001: 'SKU MissMatch / Not found',
      QRY001: 'Query Error Failed Insert',
      QRY002: 'Query error Failed Update',
      QRY003: 'Query Return Null',
      QTY001: 'Quantity Mismatch',
      SIE001: 'Signature Invalid',
      SON001: 'Order Number Null',
      SON002: 'Order Number Duplicate',
      SON003: 'Order Number Not Found',
      SON004: 'SO Not Found in Stock',
      // SSR001: 'Success Response',
      STE001: 'Out of Stock',
      TOE001: 'Token Expired',
      TOE002: 'Token Invalid',
    };

    if (codes[code]) {
      const errorMessage = `${codes[code]}. ${body.message}`;
      this.logger.error(errorMessage, body);
      throw new Error(errorMessage);
    }

    return body;
  }

  async getToken() {
    return this.cacher.wrap('ultravoucher-token', async () => {
      const response = await this.agent
        .get(`${this.options.apiBaseUrl}/api/v1/Token/accessToken`)
        .accept('json')
        .query({
          app_id: this.options.appId,
          app_key: this.options.appKey,
        })
        .then(this.responseNormalizer.bind(this))
        .catch(this.responseNormalizer.bind(this));

      this.logger.info('get token', response);
      return response.token;
    }, { ttl: 7000 });
  }

  async getBalance() {
    const response = await this.agent
      .get(`${this.options.apiBaseUrl}/api/v1/deposit/balance`)
      .accept('json')
      .query({
        app_id: this.options.appId,
        app_key: this.options.appKey,
        accesstoken: await this.getToken(),
      })
      .then(this.responseNormalizer);

    let { balance } = response.data;

    // huft api response in format like this? 9,802,000
    balance = parseInt(balance.replace(/,/g, ''), 10);

    return balance;
  }

  async getBrandList() {
    const response = await this.agent
      .get(`${this.options.apiBaseUrl}/api/v1/master/brand`)
      .accept('json')
      .query({
        app_id: this.options.appId,
        app_key: this.options.appKey,
        accesstoken: await this.getToken(),
      })
      .then(this.responseNormalizer);

    return response.data;
  }

  async getProductList() {
    const response = await this.agent
      .get(`${this.options.apiBaseUrl}/api/v1/master/sku`)
      .accept('json')
      .query({
        app_id: this.options.appId,
        app_key: this.options.appKey,
        accesstoken: await this.getToken(),
      })
      .then(this.responseNormalizer);

    return response.data;
  }

  async openOrder({
    milliseconds,
    request_id,
    order_number,
    sku,
    qty,
    receiver_name,
    receiver_email,
    receiver_phone,
  }) {
    const requestBody = {
      request_id,
      order_number,
      sku,
      qty,
      receiver_name,
      receiver_email,
      receiver_phone,
    };

    const token = await this.getToken();
    const response = await this.agent
      .post(`${this.options.apiBaseUrl}/api/v1/Orders/openOrder`)
      .set('accessToken', token)
      .set('Signature', (await Signature.openOrder({
        appKey: this.options.appKey,
        milliseconds,
        body: requestBody,
      })).signature)
      .set('milliseconds', milliseconds)
      .accept('json')
      .query({
        app_id: this.options.appId,
        app_key: this.options.appKey,
        accesstoken: token,
      })
      .type('form')
      .send(requestBody)
      .then(this.responseNormalizer);

    return response.data;
  }

  async getDataOrder({
    milliseconds,
    request_id,
    order_number,
    sku,
    qty,
    invoice_no,
    current_page,
    max_records,
  }) {
    const requestBody = {
      request_id,
      order_number,
      sku,
      qty,
      invoice_no,
      current_page,
      max_records,
    };
    const token = await this.getToken();
    const response = await this.agent
      .post(`${this.options.apiBaseUrl}/api/v1/Orders/getDataOrder`)
      .set('accessToken', token)
      .set('Signature', (await Signature.getDataOrder({
        appKey: this.options.appKey,
        milliseconds,
        body: requestBody,
      })).signature)
      .set('milliseconds', milliseconds)
      .accept('json')
      .query({
        app_id: this.options.appId,
        app_key: this.options.appKey,
        accesstoken: token,
      })
      .type('form')
      .send(requestBody)
      .then(this.responseNormalizer);

    return response;
  }

  async getHistoryOrder({
    milliseconds,
    request_id,
    start_date,
    end_date,
    current_page,
    max_records,
  }) {
    const requestBody = {
      request_id,
      start_date,
      end_date,
      current_page,
      max_records,
    };
    const token = await this.getToken();
    const response = await this.agent
      .post(`${this.options.apiBaseUrl}/api/v1/Orders/getHistory`)
      .set('accessToken', token)
      .set('milliseconds', milliseconds)
      .accept('json')
      .query({
        app_id: this.options.appId,
        app_key: this.options.appKey,
        accesstoken: token,
      })
      .type('form')
      .send(requestBody)
      .then(this.responseNormalizer.bind(this))
      .catch(this.responseNormalizer.bind(this));

    return response;
  }


}

module.exports = { Client, Signature };
