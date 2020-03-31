# Ultravoucher js

just a client i made during testing.


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
