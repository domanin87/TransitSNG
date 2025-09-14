
const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });
module.exports = { client, register };
