const serverless = require('serverless-http');
const app = require('../src/app');

console.log('✅ Backend On Running');

module.exports = serverless(app, {
  request: (req, _res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  },
});
