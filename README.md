# Ultravoucher js


## **FOR Ultravoucher API V1.8**

## Installation

```
yarn add ultravoucher
```

## Setup Client

```javascript
const { Client } = require('ultravoucher');
const client = new Client({
  appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
  appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
  apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
});
```

#### Custom logger

default logger use `console`.. will use: `console.trace`, `console.error`, `console.info`.  
Example use `noop-logger`:

```javascript
const noop = require('noop-logger');
noop.trace = noop.debug;

const client = new Client({
  appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
  appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
  apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
  logger: noop,
});
```

> actually you better provide logger to use something like `bunyan`. as it already use `log.child({ commonInfo })` if exists.


#### Custom http client (superagent api like)

this library use `superagent`. But you can use your own modified superagent. *zipkin perhaps?*

Example:

```javascript
const superagent = require('superagent');

const customAgent = superagent
  .agent()
  .use(somePlugin());

const client = new Client({
  appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
  appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
  apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
  agent: customAgent,
});
```

#### Custom cacher

this library use `cache-manager` with memory driver. for now, its only for cache token. But you can use your own modified cache-manager. *redis driver perhaps? to be used in scaled out servers.*

Example:

```javascript
const cacheManager = require('cache-manager');

const customCacher = cacheManager.caching({ store: 'memory', max: 5 });

const client = new Client({
  appId: process.env.ULTRAVOUCHER_CLIENT_APP_ID,
  appKey: process.env.ULTRAVOUCHER_CLIENT_APP_KEY,
  apiBaseUrl: process.env.ULTRAVOUCHER_CLIENT_APP_BASEURL,
  cacher: customCacher,
});
```


## Examples

#### Get Balance

```javascript
const balance = await client.getBalance();
```

#### Get Brand List

```javascript
const brands = await client.getBrandList();
```

#### Get Product List

```javascript
const brands = await client.getProductList();
```

#### Get History Data

```javascript
const milliseconds = new Date().valueOf();

const history = await client.getHistoryOrder({
  milliseconds,
  request_id: milliseconds,
  start_date: moment().subtract(10, 'day').format('YYYY-MM-DD HH:mm:ss'),
  end_date: moment().add(10, 'day').format('YYYY-MM-DD HH:mm:ss'),
  current_page: '1',
  max_records: '100',
});
```

#### Get Order Data

```javascript
const milliseconds = new Date().valueOf();

const orderData = await client.getDataOrder({
  milliseconds,
  request_id: 'reqId01',
  order_number: 'order_number',
  invoice_no: 'invoice_no',
  sku: 'some-sku',
  qty: '1',
  current_page: '1',
  max_records: '100',
});
```

#### Open Order

```javascript
const milliseconds = new Date().valueOf();

const products = await client.getProductList();
const product = products[0];

const order = await client.openOrder({
  milliseconds,
  request_id: 'reqId02',
  order_number: 'some-order-id-0001',
  sku: product.sku,
  qty: '1',
  receiver_name: 'jhon doe',
  receiver_email: 'jhon@email.com',
  receiver_phone: '0871282373744',
});
```

## License

MIT
