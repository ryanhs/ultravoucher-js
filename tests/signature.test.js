const Signature = require('../lib/signature');

describe('check signature', () => {

  it('open-order signature', async () => {
    const method = 'post';
    const appKey = '00badbceb7095896986960fe231a6fd0';
    const milliseconds = '1531987381206';
    const body = {
      request_id: 'Req01',
      order_number: '2817183923949',
      sku: 'IDD00100',
      qty: '2',
      receiver_name: 'jhon doe',
      receiver_email: 'jhon@email.com',
      receiver_phone: '0871282373744',
    };

    const secret = 'post-bbe6562ba0828a60f421f3c766fb56c3-1531987381206-/api/v1/orders/openorder';
    const signature = '39oqp2syqtDPNkbdxNluEWpUx/Csvd9HKf976ApG1Z0=';

    await expect(Signature.openOrder({
      method,
      appKey,
      milliseconds,
      body,
    }))
      .resolves
      .toEqual({ secret, signature });
  });

  it('get-data-order signature', async () => {
    const method = 'post';
    const appKey = '00badbceb7095896986960fe231a6fd0';
    const milliseconds = '1531987381206';
    const body = {
      request_id: 'Req01',
      order_number: '2817183923949',
      sku: 'IDD00100',
      qty: '2',
      invoice_no: 'PT -20200330-000001',
      current_page: '1',
      max_records: '100',
    };

    const secret = 'post-23d0acc5718db98848df9e852fe1192f-1531987381206-/api/v1/orders/getdataorder';
    const signature = 'hpuAoRSNsvE4qqE85Dta0qIfSzDxGYNP2jnrtIyYGR8=';

    await expect(Signature.getDataOrder({
      method,
      appKey,
      milliseconds,
      body,
    }))
      .resolves
      .toEqual({ secret, signature });
  });

});
