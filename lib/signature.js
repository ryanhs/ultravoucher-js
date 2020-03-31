const crypto = require('crypto');

const md5 = (plain) => crypto.createHash('md5').update(plain).digest('hex');
const hashHmac = (algo, plain, salt) => crypto
  .createHmac(algo, salt.toString())
  .update(plain.toString())
  .digest();

const makeSignature = async ({
  method = 'post', appKey, milliseconds, body, reqUrl,
}) => {

  // all properties must be in string type
  const bodyFixed = {};
  Object.keys(body).forEach((key) => {
    bodyFixed[key] = String(body[key]);
  });

  const bodyJson = JSON.stringify(bodyFixed);
  const bodyJsonMD5 = md5(bodyJson);

  const secret = `${method}-${bodyJsonMD5}-${milliseconds}-${reqUrl}`;
  const signature = hashHmac('sha256', secret, appKey);

  return { secret, signature: Buffer.from(signature).toString('base64') };
};


const openOrder = (params) => makeSignature({
  ...params,
  reqUrl: '/api/v1/orders/openorder',
});

const getDataOrder = (params) => makeSignature({
  ...params,
  reqUrl: '/api/v1/orders/getdataorder',
});

module.exports = { openOrder, getDataOrder };
