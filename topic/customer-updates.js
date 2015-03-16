var amqp = require('amqplib/callback_api');

var URL = process.env.BROKER_URL || 'amqp://localhost/blue';
var exchangeType = 'topic';
var exchangeOpts = { durable: false };
var exchange = 'YLD';

amqp.connect(URL, connected);

function connected(err, conn) {
  if (err)
    throw err;

  conn.createChannel(withChannel);
}

function withChannel(err, channel) {
  if (err)
    throw err;

  channel.assertExchange(exchange, 'topic', exchangeOpts);
  channel.assertQueue('customer.updates.queue', {}, function(err, ok) {
    if (err)
      throw err;

    var queue = ok.queue;
    console.log('binding queue %s to exchange %s', queue, exchange);
    channel.bindQueue('customer.updates.queue', exchange, 'customer.updated', {}, function(err) {
      if (err)
        throw err;

      channel.consume(queue, onMsg, { noAck: true });
    });
  });

}

function onMsg(msg) {
  var key = msg.fields.routingKey;
  var content = msg.content.toString();
  console.log('received: key [ %s ] %s', key, content);
}
