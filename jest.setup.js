const path = require('path');
const { matchers: jsonSchemaMatchers } = require('jest-json-schema');

expect.extend(jsonSchemaMatchers);
require('dotenv')
  .config({
    path: path.resolve(process.cwd(), 'jest.env'),
  });
