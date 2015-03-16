var amqp = require('amqplib/callback_api');

var URL = process.env.BROKER_URL || 'amqp://localhost/blue';
var exchange = 'YLD';
var exchangeType = 'topic';
var exchangeOpts = { durable: false };

amqp.connect(URL, connected);

function connected(err, conn) {
  if (err)
    throw err;

  conn.createChannel(withChannel);
}

function withChannel(err, channel) {
  if (err)
    throw err;

  channel.assertExchange(exchange, exchangeType, exchangeOpts, withExchange);

  function withExchange(err, ok) {
    if (err)
      throw err;

    createUser(channel, exchange);
    setTimeout(function() {
      updateUser(channel, exchange);
    }, 6000);
  }
}

function createUser(channel, exchange) {
  var key = 'customer.created';
  var customer = { name: 'blueoffice', age: 1, created_at: Date.now() };
  channel.publish(exchange, key, new Buffer(JSON.stringify(customer)));
  console.log('published:  key [ %s ],  %j', key, customer);
}

function updateUser(channel, exchange) {
  var key = 'customer.updated';
  var customer = { name: 'blueoffice-and-yet', age: 10, created_at: Date.now() };
  channel.publish(exchange, key, new Buffer(JSON.stringify(customer)));
  console.log('published:  key [ %s ],  %j', key, customer);
}
