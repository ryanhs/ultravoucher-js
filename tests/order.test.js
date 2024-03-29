const noop = require('noop-logger');
const moment = require('moment');
const { Client } = require('../lib/index');

noop.trace = noop.debug;

// to not waste any order tested

describe('order error', () => {
  let singletonOrder;

  it('can open order error not found ', async () => {
    const client = new Client({
      appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
      appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
      apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
      logger: noop,
    });

    const balance = await client.getBalance();
    // console.log('balance', { balance })

    const milliseconds = new Date().valueOf();

    const products = await client.getProductList();
    const product = products[0];
    // console.log('try to buy', product.sku, product.sku_name)

    const request = client.openOrder({
      milliseconds,
      request_id: milliseconds,
      order_number: milliseconds,
      sku: `${product.sku}not-found`,
      qty: '1',
      receiver_name: 'jhon doe',
      receiver_email: 'jhon@email.com',
      receiver_phone: '0871282373744',
    });

    await expect(request).rejects.toThrow();

    // await request.catch(console.error)
  });

  it('can open order error  qty', async () => {
    const client = new Client({
      appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
      appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
      apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
      logger: noop,
    });

    const balance = await client.getBalance();
    // console.log('balance', { balance })

    const milliseconds = new Date().valueOf();

    const products = await client.getProductList();
    const product = products[0];
    // console.log('try to buy', product.sku, product.sku_name)

    const request = client.openOrder({
      milliseconds,
      request_id: milliseconds,
      order_number: '',
      sku: product.sku,
      qty: '1',
      receiver_name: 'jhon doe',
      receiver_email: 'jhon@email.com',
      receiver_phone: '0871282373744',
    });

    await expect(request).rejects.toThrow();

    // await request.catch(console.error)
  });

});

describe('order', () => {
  let singletonOrder;

  it('can open order', async () => {
    const client = new Client({
      appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
      appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
      apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
      logger: noop,
    });

    const balance = await client.getBalance();
    // console.log('balance', { balance })

    const milliseconds = new Date().valueOf();

    const products = await client.getProductList();
    const product = products[1];
    // console.log('try to buy', product.sku, product.sku_name)

    const request = client.openOrder({
      milliseconds,
      request_id: milliseconds,
      order_number: milliseconds,
      sku: product.sku,
      qty: '1',
      receiver_name: 'jhon doe',
      receiver_email: 'jhon@email.com',
      receiver_phone: '0871282373744',
    });

    await expect(request).resolves.toMatchSchema({
      required: [
        'order_no',
        'invoice_no',
        'receiver_email',
        'receiver_mobile',
        'order_date',
        'sku',
      ],
    });

    singletonOrder = await request;
    singletonOrder.milliseconds = milliseconds;
  });

  it('can check order data', async () => {
    const client = new Client({
      appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
      appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
      apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
      logger: noop,
    });


    /*
    const milliseconds = new Date().valueOf();
    const newOrder = async () => {
      const products = await client.getProductList();
      return client.openOrder({
        milliseconds,
        request_id: milliseconds,
        order_number: milliseconds,
        sku: products[0].sku,
        qty: '1',
        receiver_name: 'jhon doe',
        receiver_email: 'jhon@email.com',
        receiver_phone: '0871282373744',
      });
    }
    const order = await newOrder();
    */

    const { milliseconds } = singletonOrder;
    const order = singletonOrder;


    const request = client.getDataOrder({
      milliseconds,
      request_id: milliseconds,
      order_number: order.order_no, // dafuq? order_no / order_number
      invoice_no: order.invoice_no,
      sku: order.sku,
      qty: '1',
      current_page: '1',
      max_records: '1',
    });
    await expect(request).resolves.not.toThrow();
    await expect(request).resolves.toMatchSchema({
      properties: {
        data: {
          type: 'array',
          items: {
            required: ['id_voucher', 'kode_voucher', 'tgl_expired'],
          },
        },
      },
      required: ['data', 'current_page', 'total_page', 'maximal_record', 'total_record'],
    });
  });

  it('can check history data', async () => {
    const client = new Client({
      appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
      appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
      apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
      logger: noop,
    });

    const milliseconds = new Date().valueOf();

    const request = client.getHistoryOrder({
      milliseconds,
      request_id: milliseconds,
      start_date: moment().subtract(10, 'day').format('YYYY-MM-DD HH:mm:ss'),
      end_date: moment().add(10, 'day').format('YYYY-MM-DD HH:mm:ss'),
      current_page: '1',
      max_records: '100',
    });
    await expect(request).resolves.not.toThrow();
    await expect(request).resolves.toMatchSchema({
      properties: {
        data: {
          type: 'array',
          items: {
            required: ['order_number', 'brand_code', 'sku_voucher', 'quantity'],
          },
        },
      },
      required: ['data', 'current_page', 'total_page', 'maximal_record', 'total_record'],
    });
  });


});

describe('fix bug 2022-05-17', () => {
  let singletonOrder;

  it('open order test UVCRK80 error!', async () => {
    const client = new Client({
      appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
      appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
      apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
      logger: noop,
    });

    // const balance = await client.getBalance();
    // console.log('balance', { balance })

    const milliseconds = new Date().valueOf();

    // const products = await client.getProductList();
    // console.log(products.map(v => [v.sku, v.sku_name]))
    // const product = products[1];
    // console.log('try to buy', product.sku, product.sku_name)

    const request = client.openOrder({
      milliseconds,
      request_id: milliseconds,
      order_number: milliseconds,
      sku: 'UVCRK80',
      qty: '1',
      receiver_name: 'jhon doe',
      receiver_email: 'jhon@email.com',
      receiver_phone: '0871282373744',
    });

    await expect(request).rejects.toThrow('out of stock');
  });

});
